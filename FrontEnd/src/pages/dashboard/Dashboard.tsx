import React, { useState, useEffect } from "react";
import { Card } from "@mui/material";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import HorizontalRule from "@mui/icons-material/HorizontalRule";
import "@assets/styles/dashboard.scss"; // Custom CSS for styling
import $axios from "@src/axios";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";
import TopProducts from "@components/dashboard/top-products/TopProducts";
import CategoryProductTable from "@components/dashboard/product-category/ProductCategory";
import { Link } from "react-router-dom";

// Define the structure of customer growth response
interface CustomerGrowthResponse {
  TotalCustomers: number;
  GrowthRatePercentage: number; // Assuming there's a growth rate percentage
}

interface PartnersResponse {
  TotalCurrentMonthCompany: number;
  GrowthRatePercentage: number;
}

const Dashboard: React.FC = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL_LOCALHOST_BE;
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("This Month");
  const [orderData, setOrderData] = useState({
    completed: 120,
    cancelled: 30,
    returned: 15,
  });
  const [categoryData, setCategoryData] = useState({
    category: "",
    quantity: 0,
  });

  const [totalOrders, setTotalOrders] = useState(10000);
  const [customerGrowthResponse, setCustomerGrowthResponse] = useState<CustomerGrowthResponse | null>(null);
  const [totalPartners, setTotalPartners] = useState<PartnersResponse | null>(null);

  const timeRanges = ["This Week", "This Month", "This Year"];
  const categories = ["Electronics", "Clothing", "Groceries", "Home & Kitchen"]; // Add your categories here

  // Sample data for chart
  const chartData = {
    labels: ["Completed", "Cancelled", "Returned"],
    datasets: [
      {
        data: [orderData.completed, orderData.cancelled, orderData.returned],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
      },
    ],
  };

  // Sample data for growth chart
  const growthChartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Growth",
        data: [50, 60, 70, 90, 120, 150], // Sample growth data
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // ======================Card ==========================//
  const cardInfo = [
    { title: "Profit", value: "$800", growth: 5 },
    {
      title: "Total Customers",
      value: customerGrowthResponse ? customerGrowthResponse.TotalCustomers.toString() : "Loading...",
      growth: customerGrowthResponse ? customerGrowthResponse.GrowthRatePercentage : 0,
    },
    { title: "Total Products", value: "30", growth: 10 },
   
    {
      title: "Total Company Partners",
      value: totalPartners ? totalPartners.TotalCurrentMonthCompany.toString() : "Loading...",
      growth: totalPartners ? totalPartners.GrowthRatePercentage : 0,
      link: baseUrl + "company",
    },
   
  ];
  // ======================End Card ==========================//

  // ===============Fetch data from APIs================
  const fetchData = async () => {
    try {
      const [customerGrowthResponse1, partnersResponse] = await Promise.all([
        $axios.get("Dashboard/CustomerGrowth"),
        $axios.get("Dashboard/CompanyGrowth"),
      ]);

      setCustomerGrowthResponse(customerGrowthResponse1.data);
      setTotalPartners(partnersResponse.data);
      setTotalOrders(partnersResponse.data.orders); // Adjust according to your API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // ===============End Fetch data from APIs================

  const handleCategoryChange = (e: any) => {
    setCategoryData({ ...categoryData, category: e.value });
    const quantity = Math.floor(Math.random() * 100); // Simulated quantity
    setCategoryData((prev) => ({ ...prev, quantity }));
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "rgba(76, 175, 80, 0.1)"; // Light green for growth
    if (growth < 0) return "rgba(244, 67, 54, 0.1)"; // Light red for decrease
    return "rgba(158, 158, 158, 0.1)"; // Light gray for no change
  };

  return (
    <div className="dashboard">
      <div className="card-container">
        {cardInfo.map((card, index) => (
         <Link to={card.link} key={index} className="card-link">
         <Card
           className="dashboard-card"
           style={{ backgroundColor: getGrowthColor(card.growth), margin: '20px' }}
         >
           <div className="card-content">
             <div>
             
               <p className="card-title">{card.title}</p>
               <h4 className="card-value">{card.value}</h4>
               <div
                 className="card-growth"
                 style={{
                   display: "flex",
                   alignItems: "center",
                   color: getGrowthColor(card.growth),
                 }}
               >
                 {card.growth > 0 ? (
                   <ArrowUpward style={{ color: "green" }} />
                 ) : card.growth < 0 ? (
                   <ArrowDownward style={{ color: "red" }} />
                 ) : (
                   <HorizontalRule style={{ color: "gray" }} />
                 )}
                 <p
                   style={{
                     color:
                       card.growth > 0
                         ? "green"
                         : card.growth < 0
                         ? "red"
                         : "black",
                   }}
                 >
                   {card.growth > 0 ? `+${card.growth}%` : `${card.growth}%`}{" "}
                   from last month
                 </p>
               </div>
             </div>
           </div>
         </Card>
       </Link>
       
        ))}
      </div>

      <div className="charts mt-5">
        <div className="row">
          <div className="col-lg-6">
            <Chart type="doughnut" data={chartData} width="400px" />
            <p className="chart-title">Order Status Distribution</p>
          </div>
          <div className="col-lg-6">
            <Chart type="line" data={growthChartData} />
            <p className="chart-title">Monthly Growth</p>
          </div>
        </div>
      </div>

      <div className="card card-product">
        <div className="row">
          <div className="col-lg-6">
            <div className="top-products">
              <TopProducts />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="top-products">
              <CategoryProductTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
