using Microsoft.EntityFrameworkCore;

namespace AuthenticationJWT.Services
{
    public class ExpiredSaleUpdater : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ExpiredSaleUpdater> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(1); // Kiểm tra mỗi phút

        public ExpiredSaleUpdater(IServiceProvider serviceProvider, ILogger<ExpiredSaleUpdater> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ExpiredSaleUpdater service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await UpdateExpiredSalesAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating expired sales.");
                }

                await Task.Delay(_checkInterval, stoppingToken); // Delay để tránh việc kiểm tra liên tục
            }

            _logger.LogInformation("ExpiredSaleUpdater service is stopping.");
        }

        private async Task UpdateExpiredSalesAsync()
        {
            using (var scope = _serviceProvider.CreateScope()) // Tạo một scope mới cho mỗi lần truy vấn
            {
                var db = scope.ServiceProvider.GetRequiredService<MyContext>();
                var now = DateTime.Now;

                _logger.LogInformation($"Checking for expired sales at {now}.");

                // Tìm các Sale đã hết hạn và vẫn đang active
                var expiredSales = await db.Sale
                                           .Where(s => s.EndDate < now && s.Status == 1 && s.DeletedAt == null)
                                           .ToListAsync();

                _logger.LogInformation($"Found {expiredSales.Count} expired sales.");

                if (expiredSales.Any())
                {
                    foreach (var sale in expiredSales)
                    {
                        sale.Status = 0; // Cập nhật trạng thái hết hạn
                        sale.UpdateAt = now; // Cập nhật thời gian cập nhật

                    }

                    await db.SaveChangesAsync(); // Thực hiện lưu thay đổi bất đồng bộ
                    _logger.LogInformation($"Updated {expiredSales.Count} sales to Status = 0.");
                }
                else
                {
                    _logger.LogInformation("No expired sales to update.");
                }
            }
        }
    }
}
