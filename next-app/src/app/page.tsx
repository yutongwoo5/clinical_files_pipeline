'use client'

import { query } from '../lib/db';
import { useState } from 'react';
import Image from 'next/image';
import { Bar } from 'react-chartjs-2';

interface Trial {
  nct_number: string;
  title: string;
  conditions: string;
  sponsor: string;
}

const HomePage = async () => {
  const [sponsorData, setSponsorData] = useState<any>({});
  const [conditionData, setConditionData] = useState<any>({});
  try {
    console.log('Fetching data from the database...');
    const result = await query('SELECT * FROM us');
    const result_eu = await query('SELECT * FROM eu');
    console.log('Data fetched:', result.rows[0]);
    const data = result.rows;
    const data_eu = result_eu.rows;


    const trials: Trial[] = result.rows;
    const sponsorCount: { [key: string]: number } = {};
    const conditionCount: { [key: string]: number } = {};

    trials.forEach((item) => {
      sponsorCount[item.sponsor] = (sponsorCount[item.sponsor] || 0) + 1;
      item.conditions.split('|').forEach((condition) => {
           conditionCount[condition] = (conditionCount[condition] || 0) + 1;
         });

    });

    console.log("sponsorCount is", sponsorCount);
    console.log("conditionCount is", conditionCount);


    setSponsorData({
        labels: Object.keys(sponsorCount),
        datasets: [
          {
            label: 'Number of Trials by Sponsor',
            data: Object.values(sponsorCount),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

    setConditionData({
        labels: Object.keys(conditionCount),
        datasets: [
          {
            label: 'Number of Trials by Condition',
            data: Object.values(conditionCount),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      });

    console.log("sponsorData is ", sponsorData);

    return (
      <div>
        <div>
            <h2>Number of Trials by Sponsor</h2>
            {/*<Bar data={sponsorData} />*/}
        </div>
        <div>
            <h2>Number of Trials by Condition</h2>
            {/*<Bar data={conditionData} />*/}
        </div>
        <h1 style={{ fontSize: '24px' }}>US Results fetched from ClinicalTrials.gov</h1>
        <table>
          <thead>
            <tr>
              <th>NCT Number</th>
              <th>Study Title</th>
              <th>Conditions</th>
              <th>Sponsor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.nct_number}</td> {/* Replace these with actual column names */}
                <td>{item.title}</td>
                <td>{item.conditions}</td>
                <td>{item.sponsor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h1 style={{ fontSize: '24px' }}>EU Results fetched from clinicaltrialsregister.eu</h1>
          <table>
          <thead>
            <tr>
              <th>NCT Number</th>
              <th>Study Title</th>
              <th>Conditions</th>
              <th>Sponsor</th>
            </tr>
          </thead>
          <tbody>
            {data_eu.map((item: any, index: number) => (
              <tr key={index}>
                <td>{item.EudraCT_number}</td> {/* Replace these with actual column names */}
                <td>{item.title}</td>
                <td>{item.conditions}</td>
                <td>{item.sponsor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
      return (
      <div>
        <h1>Error fetching data</h1>
        <p>{error.message}</p>
      </div>
    );
  }
};

export default HomePage;



// import { query } from '../lib/db';
//
// const HomePage = async () => {
//   const result = await query('SELECT * FROM us'); // Replace 'your_table' with your actual table name
//   const data = result.rows;
//
//   return (
//     <div>
//       <h1>Data from PostgreSQL</h1>
//       <ul>
//         {data.map((item: any, index: number) => (
//           <li key={index}>{item.sponsor}</li> // Replace 'your_column_name' with your actual column name
//         ))}
//       </ul>
//     </div>
//   );
// };
//
// export default HomePage;


// "use client"; // Add this directive at the top
//
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
//
// interface Data {
//   nct_number: string;
//   study_title: string;
//   conditions: string;
//   sponsor: string;
//   route: number;
// }
//
// interface ChartData {
//   sponsor?: string;
//   condition?: string;
//   route: number;
// }
//
// const HomePage: React.FC = () => {
//   const [sponsorData, setSponsorData] = useState<Data[]>([]);
//   const [conditionData, setConditionData] = useState<Data[]>([]);
//   const [allData, setAllData] = useState<Data[]>([]);
//
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const sponsorResponse = await axios.get<Data[]>('/api/sponsors');

//         setSponsorData(sponsorResponse.data);
//
//         const conditionResponse = await axios.get<Data[]>('/api/conditions');
//         setConditionData(conditionResponse.data);
//
//         const allDataResponse = await axios.get<Data[]>('/api/route/all');
//         setAllData(allDataResponse.data);
//       } catch (error) {
//         console.error('Error fetching data', error);
//       }
//     };
//
//     fetchData();
//   }, []);
//
//   return (
//     <div>
//       <h1>Clinical Trials Data</h1>
//       <h2>Trials by Sponsor</h2>
//       <BarChart width={600} height={300} data={sponsorData}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="sponsor" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="route" fill="#8884d8" />
//       </BarChart>
//       <h2>Trials by Condition</h2>
//       <BarChart width={600} height={300} data={conditionData}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="condition" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="route" fill="#82ca9d" />
//       </BarChart>
//       <h2>All Data</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>NCT Number</th>
//             <th>Study Title</th>
//             <th>Conditions</th>
//             <th>Sponsor</th>
//           </tr>
//         </thead>
//         <tbody>
//           {allData.map((item, index) => (
//             <tr key={index}>
//               <td>{item.nct_number}</td>
//               <td>{item.study_title}</td>
//               <td>{item.conditions}</td>
//               <td>{item.sponsor}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//
//   );
// };
//
// export default HomePage;
//
