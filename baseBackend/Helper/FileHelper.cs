namespace AuthenticationJWT.Helper;

public class FileHelper
{
    public static string generateFileName(string filename)
    {
        var name = Guid.NewGuid().ToString();
        var lastIndex = filename.LastIndexOf('.');
        var ext = filename.Substring(lastIndex);
        return name + ext;
    }
}
