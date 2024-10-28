"use client";

import { useEffect, useState } from 'react';
import { auth } from '../../../lib/firebase'; // Import Firebase auth
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { VictoryChart, VictoryLine, VictoryBar, VictoryAxis, VictoryTooltip } from 'victory'; // Import Victory components
import { getFirestore, getDoc, doc } from 'firebase/firestore';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null); // State to hold user info
  const [loginFrequencyData, setLoginFrequencyData] = useState([]); // State to hold login frequency chart data
  const [userCountData, setUserCountData] = useState([]); // State to hold user count chart data
  const [salesPerWeekData, setSalesPerWeekData] = useState([]); // State to hold sales per week chart data
  const [newUsersCountData, setNewUsersCountData] = useState([]); // State to hold new users count chart data
  const db = getFirestore(); // Initialize Firestore

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the logged-in user
        fetchChartData(); // Fetch data for the charts
      } else {
        router.push('/'); // Redirect to login if not logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const fetchChartData = async () => {
    try {
      // Fetch login frequency data
      const loginFrequencyRef = doc(db, "analytics", "loginFrequency");
      const loginFrequencySnap = await getDoc(loginFrequencyRef);

      if (loginFrequencySnap.exists()) {
        const loginFrequency = loginFrequencySnap.data();
        setLoginFrequencyData(loginFrequency.data); // Assuming data is in an array under a "data" key
        console.log(loginFrequency);
      } else {
        console.log("No such login frequency document!");
      }

      // Fetch user count data
      const userCountRef = doc(db, "analytics", "userCount");
      const userCountSnap = await getDoc(userCountRef);

      if (userCountSnap.exists()) {
        const userCount = userCountSnap.data();
        setUserCountData(userCount.data); // Assuming data is in an array under a "data" key
        console.log(userCount);
      } else {
        console.log("No such user count document!");
      }

      // Fetch sales per week data
      const salesPerWeekRef = doc(db, "analytics", "salesPerWeek");
      const salesPerWeekSnap = await getDoc(salesPerWeekRef);

      if (salesPerWeekSnap.exists()) {
        const salesPerWeek = salesPerWeekSnap.data();
        setSalesPerWeekData(salesPerWeek.data); // Assuming data is in an array under a "data" key
        console.log(salesPerWeek);
      } else {
        console.log("No such sales per week document!");
      }

      // Fetch new users count data
      const newUsersCountRef = doc(db, "analytics", "newUsersCount");
      const newUsersCountSnap = await getDoc(newUsersCountRef);

      if (newUsersCountSnap.exists()) {
        const newUsersCount = newUsersCountSnap.data();
        setNewUsersCountData(newUsersCount.data); // Assuming data is in an array under a "data" key
        console.log(newUsersCount);
      } else {
        console.log("No such new users count document!");
      }

    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      localStorage.setItem('isLoggedIn', 'false'); // Update localStorage
      router.push('/'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error); // Handle logout error
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-semibold mb-1 text-black-600 text-center">Welcome, {user ? user.email : 'User'}!</h1>
      <button
        onClick={handleLogout}
        className="p-3 mt-4 text-lg font-semibold text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Logout
      </button>

      {/* Charts Section */}
      <div className="w-full mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Analytics Dashboard</h2>

        {/* Grid for charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg mb-2 text-gray-600">Login Frequency</h3>
            <VictoryChart domainPadding={20}>
              <VictoryLine
                data={loginFrequencyData}
                x="date" 
                y="logins"
                labels={({ datum }) => `Logins: ${datum.logins}`}
                labelComponent={<VictoryTooltip />}
                style={{ data: { stroke: "blue" } }}
              />
              <VictoryAxis />
              <VictoryAxis dependentAxis tickFormat={(t) => `${t}`} />
            </VictoryChart>
          </div>

          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg mb-2 text-gray-600">User Counts Per Month</h3>
            <VictoryChart domainPadding={20}>
              <VictoryBar
                data={userCountData}
                x="month"
                y="count"
                labels={({ datum }) => `Count: ${datum.count}`}
                labelComponent={<VictoryTooltip />}
                style={{ data: { fill: "blue" } }}
              />
              <VictoryAxis tickValues={['January', 'February', 'March', 'April', 'May', 'June', 'July']} />
              <VictoryAxis dependentAxis tickFormat={(t) => `${t}`} />
            </VictoryChart>
          </div>

          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg mb-2 text-gray-600">Sales Per Week</h3>
            <VictoryChart domainPadding={20}>
              <VictoryLine
                data={salesPerWeekData}
                x="week" 
                y="sales"
                labels={({ datum }) => `Sales: ${datum.sales}`}
                labelComponent={<VictoryTooltip />}
                style={{ data: { stroke: "blue" } }}
              />
              <VictoryAxis />
              <VictoryAxis dependentAxis tickFormat={(t) => `R${t}`} />
            </VictoryChart>
          </div>

          <div className="border p-4 rounded-lg shadow-md">
            <h3 className="text-lg mb-2 text-gray-600">New Users Count</h3>
            <VictoryChart domainPadding={20}>
              <VictoryBar
                data={newUsersCountData}
                x="month"
                y="newUsers"
                labels={({ datum }) => `New Users: ${datum.newUsers}`}
                labelComponent={<VictoryTooltip />}
                style={{ data: { fill: "blue" } }}
              />
              <VictoryAxis tickValues={['January', 'February', 'March', 'April', 'May', 'June', 'July']} />
              <VictoryAxis dependentAxis tickFormat={(t) => `${t}`} />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
}
