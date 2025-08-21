import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import UploadModal from "../component/UploadModal";
import axios from "axios";

const StatisticsDashboard = () => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const [chartArray, setChartArray] = useState();
  
  useEffect(() => {
    const fetchData = () => {
        const data = [
          {
              "Date": "2010-06-29",
              "High": 5.0,
              "Low": 3.508
          },
          {
              "Date": "2010-06-30",
              "High": 6.084,
              "Low": 4.66
          },
          {
              "Date": "2010-07-01",
              "High": 5.184,
              "Low": 4.054
          },
          {
              "Date": "2010-07-02",
              "High": 4.62,
              "Low": 3.742
          },
          {
              "Date": "2010-07-06",
              "High": 4.0,
              "Low": 3.166
          },
          {
              "Date": "2010-07-07",
              "High": 3.326,
              "Low": 2.996
          },
          {
              "Date": "2010-07-08",
              "High": 3.504,
              "Low": 3.114
          },
          {
              "Date": "2010-07-09",
              "High": 3.58,
              "Low": 3.31
          },
          {
              "Date": "2010-07-12",
              "High": 3.614,
              "Low": 3.4
          },
          {
              "Date": "2010-07-13",
              "High": 3.728,
              "Low": 3.38
          },
          {
              "Date": "2010-07-14",
              "High": 4.03,
              "Low": 3.552
          },
          {
              "Date": "2010-07-15",
              "High": 4.3,
              "Low": 3.8
          },
          {
              "Date": "2010-07-16",
              "High": 4.26,
              "Low": 4.01
          },
          {
              "Date": "2010-07-19",
              "High": 4.45,
              "Low": 4.184
          },
          {
              "Date": "2010-07-20",
              "High": 4.37,
              "Low": 4.01
          },
          {
              "Date": "2010-07-21",
              "High": 4.18,
              "Low": 3.9
          },
          {
              "Date": "2010-07-22",
              "High": 4.25,
              "Low": 4.074
          },
          {
              "Date": "2010-07-23",
              "High": 4.312,
              "Low": 4.212
          },
          {
              "Date": "2010-07-26",
              "High": 4.3,
              "Low": 4.06
          },
          {
              "Date": "2010-07-27",
              "High": 4.236,
              "Low": 4.052
          },
          {
              "Date": "2010-07-28",
              "High": 4.18,
              "Low": 4.102
          },
          {
              "Date": "2010-07-29",
              "High": 4.176,
              "Low": 4.0
          },
          {
              "Date": "2010-07-30",
              "High": 4.088,
              "Low": 3.91
          },
          {
              "Date": "2010-08-02",
              "High": 4.194,
              "Low": 4.066
          },
          {
              "Date": "2010-08-03",
              "High": 4.39,
              "Low": 4.164
          },
          {
              "Date": "2010-08-04",
              "High": 4.436,
              "Low": 4.17
          },
          {
              "Date": "2010-08-05",
              "High": 4.31,
              "Low": 4.01
          },
          {
              "Date": "2010-08-06",
              "High": 4.032,
              "Low": 3.904
          },
          {
              "Date": "2010-08-09",
              "High": 3.996,
              "Low": 3.89
          },
          {
              "Date": "2010-08-10",
              "High": 3.93,
              "Low": 3.764
          },
          {
              "Date": "2010-08-11",
              "High": 3.776,
              "Low": 3.57
          },
          {
              "Date": "2010-08-12",
              "High": 3.58,
              "Low": 3.478
          },
          {
              "Date": "2010-08-13",
              "High": 3.69,
              "Low": 3.532
          },
          {
              "Date": "2010-08-16",
              "High": 3.76,
              "Low": 3.652
          },
          {
              "Date": "2010-08-17",
              "High": 3.88,
              "Low": 3.756
          },
          {
              "Date": "2010-08-18",
              "High": 3.918,
              "Low": 3.72
          },
          {
              "Date": "2010-08-19",
              "High": 3.85,
              "Low": 3.666
          },
          {
              "Date": "2010-08-20",
              "High": 3.822,
              "Low": 3.702
          },
          {
              "Date": "2010-08-23",
              "High": 4.078,
              "Low": 3.8
          },
          {
              "Date": "2010-08-24",
              "High": 3.942,
              "Low": 3.79
          },
          {
              "Date": "2010-08-25",
              "High": 3.996,
              "Low": 3.712
          },
          {
              "Date": "2010-08-26",
              "High": 4.054,
              "Low": 3.92
          },
          {
              "Date": "2010-08-27",
              "High": 3.974,
              "Low": 3.9
          },
          {
              "Date": "2010-08-30",
              "High": 4.038,
              "Low": 3.922
          },
          {
              "Date": "2010-08-31",
              "High": 3.958,
              "Low": 3.866
          },
          {
              "Date": "2010-09-01",
              "High": 4.138,
              "Low": 3.92
          },
          {
              "Date": "2010-09-02",
              "High": 4.248,
              "Low": 4.062
          },
          {
              "Date": "2010-09-03",
              "High": 4.26,
              "Low": 4.132
          },
          {
              "Date": "2010-09-07",
              "High": 4.2,
              "Low": 4.1
          },
          {
              "Date": "2010-09-08",
              "High": 4.19,
              "Low": 4.12
          },
          {
              "Date": "2010-09-09",
              "High": 4.21,
              "Low": 4.138
          },
          {
              "Date": "2010-09-10",
              "High": 4.186,
              "Low": 3.952
          },
          {
              "Date": "2010-09-13",
              "High": 4.18,
              "Low": 4.1
          },
          {
              "Date": "2010-09-14",
              "High": 4.32,
              "Low": 4.106
          },
          {
              "Date": "2010-09-15",
              "High": 4.4,
              "Low": 4.158
          },
          {
              "Date": "2010-09-16",
              "High": 4.632,
              "Low": 4.168
          },
          {
              "Date": "2010-09-17",
              "High": 4.264,
              "Low": 3.96
          }, ]
    //     const response = await axios.get(URL, {
    //       headers: {
    //         "ngrok-skip-browser-warning": "true",
    //       }}
    //      );
      setChartArray(transformData(data));
      console.log(transformData(data));
    };
      fetchData();
    
  }, []);

  function transformData(data) {
    const monthMap = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
        "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
        "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
    };

    let monthlyData = {};

    data.forEach(({ Date, High, Low }) => {
        let month = Date.substring(5, 7); // Extract month
        let monthName = monthMap[month];

        if (!monthlyData[monthName]) {
            monthlyData[monthName] = { month: monthName, high: 0, low: 0 };
        }

        monthlyData[monthName].high += Math.round(High * 100);   
        monthlyData[monthName].low += Math.round(Low * 100); 
    });

    let transformedData = Object.values(monthlyData);

    // Calculate highest, lowest, and average
    let stats = {
        highestNewUsers: Math.max(...transformedData.map(d => d.high)),
        lowestNewUsers: Math.min(...transformedData.map(d => d.low)),
        averageNewUsers: Math.round(transformedData.reduce((sum, d) => sum + d.high, 0) / transformedData.length),

        highestUniqueUsers: Math.max(...transformedData.map(d => d.low)),
        lowestUniqueUsers: Math.min(...transformedData.map(d => d.low)),
        averageUniqueUsers: Math.round(transformedData.reduce((sum, d) => sum + d.low, 0) / transformedData.length),
    };

    return { transformedData, stats };
}

  const futurePrediction = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    high: 800 + i * 50 + Math.floor(Math.random() * 100),
    low: 850 + i * 40 + Math.floor(Math.random() * 80),
  }));

  const statsCards = [
    { title: "Highest Value", value: `${chartArray?.stats?.highestNewUsers}`, bgColor: "bg-indigo-500" },
    { title: "Lowest Value", value: `${chartArray?.stats?.lowestNewUsers}`, bgColor: "bg-blue-500" },
    { title: "Average Value", value: `${chartArray?.stats?.averageNewUsers}`, bgColor: "bg-pink-500" },
  ];

  return (
    <div className="p-12 bg-white min-h-screen w-full">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-1 text-black">
            General Statistics
          </h1>
          <p className="text-gray-500 mb-6">
            Your data, your progress—let’s keep going!
          </p>
        </div>

        <div className="flex justify-end items-center mb-6 space-x-4">
                  <button
                    className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-800 transition cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload files
                  </button>
                </div>

        {/* <div className="flex justify-end items-center mb-6 space-x-4">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload files
          </button>
        </div> */}
      </div>


      <div className="grid grid-cols-3 gap-6 mb-12">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} p-6 rounded-lg text-white shadow-lg hover:scale-105 transition-transform duration-200`}
          >
            <div className="text-4xl font-bold mb-2">{card.value}</div>
            <div className="text-lg opacity-90">{card.title}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="font-medium text-gray-800 text-lg mb-4">
            Previous Year Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...chartArray?.transformedData, ...futurePrediction]}>
              <XAxis dataKey="month" tick={{ fill: "#4B5563" }} scale="band"/>
              <YAxis tick={{ fill: "#4B5563" }} scale="linear" domain={[0, 'auto']} tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${value}`}/>
              <Legend />
              <Bar dataKey="high" fill="#6366F1" barSize={40} />
              <Bar dataKey="low" fill="#F87171" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6  mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-800 text-lg">
              Yearly Dynamics 2024{" "}
            </h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartArray?.transformedData}>
              <XAxis dataKey="month" tick={{ fill: "#4B5563" }} />
              <YAxis tick={{ fill: "#4B5563" }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="low"
                stroke="#F87171"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-12">
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Past Analysis
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={chartArray.transformedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="month" />
              <PolarRadiusAxis />
              <Radar
                name="High"
                dataKey="high"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.6}
              />
              <Radar
                name="Low"
                dataKey="low"
                stroke="#F87171"
                fill="#F87171"
                fillOpacity={0.6}
              />
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Future Prediction
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={futurePrediction}>
              <defs>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorUniqueUsers"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#F87171" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="high"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorNewUsers)"
              />
              <Area
                type="monotone"
                dataKey="low"
                stroke="#F87171"
                fillOpacity={1}
                fill="url(#colorUniqueUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          showExtra={false}
          setFile={setFile}
          type={"stats"}
        />
      )}
    </div>

  );
};

export default StatisticsDashboard;
