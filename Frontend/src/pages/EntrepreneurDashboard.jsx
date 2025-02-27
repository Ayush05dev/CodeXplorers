import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import axiosInstance from '../api/axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";

export default function EntrepreneurDashboard() {
  const [investors, setInvestors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [startups, setStartups] = useState(null);

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userId = decodedToken?.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch investors
        const investorResponse = await axiosInstance.get('/investors');
        setInvestors(investorResponse.data);
        
        // Fetch entrepreneur's startup details (only if user is logged in)
        if (userId) {
          const startupResponse = await axiosInstance.get(`/startups/${userId}`);
          setStartups(startupResponse.data);
        }

        setError('');
      } catch (err) {
        setError('Failed to fetch data.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handlePitch = async (investorId) => {
    try {
      toast.success(`Pitch Request Sent to Investor ${investorId}`, {
        style: {
          border: '1px solid black',
          padding: '16px',
          color: 'black',
        },
        iconTheme: {
          primary: 'black',
          secondary: 'white',
        },
      });
    } catch (err) {
      setError('Failed to send pitch request.');
      console.error('Pitch error:', err);
    }
  };

  // Format currency helper function
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Get badge color based on risk level
  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': default: return 'bg-green-500 text-white';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow px-6 md:px-12 py-8 pt-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>

          {/* Navigation Buttons */}
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <Link to="/createstartup" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-800">
              Create Startup
            </Link>
            <Link to="/pitch-evaluation" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-800">
              Pitch Evaluation
            </Link>
            <Link to="/business-plan" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-800">
              Business Plan
            </Link>
          </div>
        </div>

        {/* Entrepreneur Profile Section */}
        {startups && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Entrepreneur Profile</h2>
            <p><strong>Name:</strong> {startups.name}</p>
            <p><strong>Description:</strong> {startups.description}</p>
            <p><strong>Industry:</strong> {startups.industry}</p>
            <p><strong>Pitch Deck:</strong> {startups.pitchdeck}</p>
            <p><strong>Funding Needs:</strong> {formatCurrency(startups.fundingNeeds)}</p>
            <div className="mt-4">
              <Link to="/investorpreference" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">
                Edit Preferences
              </Link>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-36"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        ) : investors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">No investors available at the moment.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor) => (
              <Card key={investor._id} className="bg-white rounded-xl shadow-sm hover:shadow-md overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-900">{investor.name}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(investor.riskLevel)}`}>
                      {investor.riskLevel} Risk
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">{formatCurrency(investor.investmentCapacity)}</p>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Industries:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {investor.industryPreferences?.map((industry, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-900 text-xs rounded">
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => handlePitch(investor._id)} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-800">
                    Send Pitch
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}



// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Card from '../components/Card';
// import axiosInstance from '../api/axios';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { jwtDecode } from "jwt-decode";


// export default function EntrepreneurDashboard() {
//   const [investors, setInvestors] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [startups, setStartups] = useState([]);

//   const token = localStorage.getItem("token");
//   const decodedToken = token ? jwtDecode(token) : null;
//   const userId = decodedToken?.id;

//   // useEffect(() => {
//   //   const fetchInvestors = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const response = await axiosInstance.get('/investors');
//   //       setInvestors(response.data);
//   //       setError('');
//   //     } catch (err) {
//   //       setError('Failed to fetch investors.');
//   //       console.error('Fetch investors error:', err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchInvestors();
//   // }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const InvestorResponse = await axiosInstance.get('/investors');
//         setInvestors(response.data);
        
//         if(userId){
//           const startupResponse=await axiosInstance.get(`/startups/${userId}`);
//           setStartups(startupResponse.data)
//         }
//         setError('');
//       } catch (err) {
//         setError('Failed to fetch investors.');
//         console.error('Fetch investors error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [userId]);

//   const handlePitch = async (investorId) => {
//     try {
//       toast.success('Pitch Request Send.', {
//         style: {
//           border: '1px solid black',
//           padding: '16px',
//           color: 'black',
//         },
//         iconTheme: {
//           primary: 'black',
//           secondary: 'white',
//         },
//       });
//     } catch (err) {
//       setError('Failed to send pitch request.');
//       console.error('Pitch error:', err);
//     }
//   };

//   // Helper function to format currency
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       maximumFractionDigits: 0
//     }).format(value);
//   };

//   // Helper function to determine risk level badge color
//   const getRiskBadgeColor = (riskLevel) => {
//     switch(riskLevel?.toLowerCase()) {
//       case 'high':
//         return 'bg-gray-900 text-white';
//       case 'medium':
//         return 'bg-gray-700 text-white';
//       case 'low':
//       default:
//         return 'bg-gray-300 text-gray-900';
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="flex-grow px-6 md:px-12 py-8 pt-24 max-w-7xl mx-auto w-full">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
          
//           {/* Navigation Buttons */}
//           <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
//             <Link
//               to="/createstartup"
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//             >
//               Create Startup
//             </Link>
//             <Link
//               to="/pitch-evaluation"
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//             >
//               Pitch Evaluation
//             </Link>
//             <Link
//               to="/business-plan"
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//             >
//               Business Plan
//             </Link>
//           </div>
//         </div>

//         {/* Enterpreneur Profile Section */}
//         {startups && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-4">Enterpreneur Profile</h2>
//             <p><strong>Name:</strong> {startups.name}</p>
//             <p><strong>Description:</strong> {startups.description}</p>
//             <p><strong>Industry :</strong> {startups.industry}</p>
//             <p><strong>PitchDeck :</strong> {startups.pitchdeck}</p>
//             <p><strong>Funding Needs:</strong> ${startups.fundingNeeds && startups.fundingNeeds.toLocaleString()}</p>
//             <div className="mt-4">
//               <Link to="/investorpreference" className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-800 transition-all">
//                 Edit Preferences
//               </Link>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-pulse flex space-x-4">
//               <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
//               <div className="space-y-4">
//                 <div className="h-4 bg-gray-300 rounded w-36"></div>
//                 <div className="h-4 bg-gray-300 rounded w-24"></div>
//               </div>
//             </div>
//           </div>
//         ) : investors.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <p className="text-gray-600 mb-4">No investors available at the moment.</p>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-800 transition-all"
//             >
//               Refresh
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {investors.map((investor) => (
//               <Card key={investor._id} className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
//                 <div className="p-5 flex flex-col h-full">
//                   <div className="flex items-start justify-between mb-4">
//                     <h2 className="text-xl font-bold text-gray-900">{investor.name}</h2>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(investor.riskLevel)}`}>
//                       {investor.riskLevel} Risk
//                     </span>
//                   </div>
                  
//                   <div className="mb-6">
//                     <div className="flex items-center mb-3">
//                       <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       <span className="font-medium text-gray-900">{formatCurrency(investor.investmentCapacity)}</span>
//                     </div>
                    
//                     <div className="flex flex-col">
//                       <span className="text-sm text-gray-500 mb-1">Industries</span>
//                       <div className="flex flex-wrap gap-2">
//                         {investor.industryPreferences && investor.industryPreferences.map((industry, index) => (
//                           <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-zinc-950">
//                             {industry}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Additional investor details if available */}
//                   {investor.description && (
//                     <p className="text-gray-600 text-sm mb-4 line-clamp-3">{investor.description}</p>
//                   )}

//                   {/* Button aligned at the bottom */}
//                   <div className="mt-auto pt-4 border-t border-gray-100">
//                     <button
//                       onClick={() => handlePitch()}
//                       className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium flex items-center justify-center"
//                     >
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
//                       </svg>
//                       Pitch Idea
//                     </button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Card from '../components/Card';
// import axiosInstance from '../api/axios';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { jwtDecode } from "jwt-decode";

// const token = localStorage.getItem("token");
// const decodedToken = token ? jwtDecode(token) : null;
// const userId = decodedToken?.id;

// export default function EntrepreneurDashboard() {
//   const [entrepreneur, setEntrepreneur] = useState(null);
//   const [investors, setInvestors] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEntrepreneurDetails = async () => {
//       try {
//         const response = await axiosInstance.get(`/entrepreneurs/${userId}`);
//         setEntrepreneur(response.data);
//       } catch (err) {
//         setError('Failed to fetch entrepreneur details.');
//         console.error('Fetch entrepreneur error:', err);
//       }
//     };

//     const fetchInvestors = async () => {
//       try {
//         const response = await axiosInstance.get('/investors');
//         setInvestors(response.data);
//       } catch (err) {
//         setError('Failed to fetch investors.');
//         console.error('Fetch investors error:', err);
//       }
//     };

//     fetchEntrepreneurDetails();
//     fetchInvestors();
//     setLoading(false);
//   }, []);

//   const handlePitch = async (investorId) => {
//     try {
//       toast.success('Pitch Request Sent.', {
//         style: { border: '1px solid black', padding: '16px', color: 'black' },
//         iconTheme: { primary: 'black', secondary: 'white' },
//       });
//     } catch (err) {
//       setError('Failed to send pitch request.');
//       console.error('Pitch error:', err);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="flex-grow px-6 md:px-12 py-8 pt-24 max-w-7xl mx-auto w-full">
//         <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
        
//                  {/* Navigation Buttons */}
//            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
//              <Link
//               to="/createstartup"
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//             >
//                Create Startup
//              </Link>
//              <Link
//               to="/pitch-evaluation"
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//             >
//               Pitch Evaluation
//             </Link>
//             <Link
//               to="/business-plan"
//               className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
//             >
//               Business Plan
//             </Link>
//           </div>
//         </div>

//                  {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}
        
//         {loading ? (
//           <p>Loading...</p>
//         ) : entrepreneur ? (
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-2xl font-semibold">{entrepreneur.name}</h2>
//             <p className="text-gray-700 mt-2">{entrepreneur.description}</p>
//             <p className="text-gray-600 mt-2"><strong>Industry:</strong> {entrepreneur.industry}</p>
//             <p className="text-gray-600 mt-2"><strong>Funding Needs:</strong> ${entrepreneur.fundingNeeds}</p>
//             {entrepreneur.pitchDeck && (
//               <a href={entrepreneur.pitchDeck} target="_blank" rel="noopener noreferrer" className="text-blue-600 mt-2 inline-block">View Pitch Deck</a>
//             )}
//           </div>
//         ) : (
//           <p>No entrepreneur details found.</p>
//         )}

//         <h2 className="text-2xl font-semibold mt-8">Potential Investors</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//           {investors.map((investor) => (
//             <Card key={investor._id} className="p-4 bg-white shadow-md rounded-lg">
//               <h3 className="text-xl font-bold">{investor.name}</h3>
//               <p className="text-gray-600">Investment: ${investor.investmentCapacity}</p>
//               <button
//                 onClick={() => handlePitch(investor._id)}
//                 className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
//               >
//                 Pitch Idea
//               </button>
//             </Card>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }


// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import axiosInstance from '../api/axios';
// import { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { jwtDecode } from "jwt-decode";

// const token = localStorage.getItem("token");
// const userId = token ? jwtDecode(token)?.id : null;

// export default function EntrepreneurDashboard() {
//   const [entrepreneur, setEntrepreneur] = useState(null);
//   const [investors, setInvestors] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!userId) return; // Prevent API calls if userId is null

//     const fetchData = async () => {
//       try {
//         const [entrepreneurResponse, investorsResponse] = await Promise.all([
//           axiosInstance.get(`/entrepreneurs/${userId}`),
//           axiosInstance.get('/investors')
//         ]);

//         setEntrepreneur(entrepreneurResponse.data);
//         setInvestors(investorsResponse.data);
//       } catch (err) {
//         setError('Failed to fetch data.');
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false); // Ensure loading stops only after API calls
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const handlePitch = async (investorId) => {
//     try {
//       toast.success('Pitch Request Sent.', {
//         style: { border: '1px solid black', padding: '16px', color: 'black' },
//         iconTheme: { primary: 'black', secondary: 'white' },
//       });
//     } catch (err) {
//       setError('Failed to send pitch request.');
//       console.error('Pitch error:', err);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <Navbar />
//       <main className="flex-grow px-6 md:px-12 py-8 pt-24 max-w-7xl mx-auto w-full">
//         <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>

//         {/* Navigation Buttons */}
//         <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
//           <Link
//             to="/createstartup"
//             className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-800 transition-all"
//           >
//             Create Startup
//           </Link>
//           <Link
//             to="/pitch-evaluation"
//             className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-800 transition-all"
//           >
//             Pitch Evaluation
//           </Link>
//           <Link
//             to="/business-plan"
//             className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-800 transition-all"
//           >
//             Business Plan
//           </Link>
//         </div>

//         {/* Display Errors */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Loading State */}
//         {loading ? (
//           <p>Loading...</p>
//         ) : entrepreneur ? (
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-2xl font-semibold">{entrepreneur.name}</h2>
//             <p className="text-gray-700 mt-2">{entrepreneur.description}</p>
//             <p className="text-gray-600 mt-2"><strong>Industry:</strong> {entrepreneur.industry}</p>
//             <p className="text-gray-600 mt-2"><strong>Funding Needs:</strong> ${entrepreneur.fundingNeeds}</p>
//             {entrepreneur.pitchDeck && (
//               <a href={entrepreneur.pitchDeck} target="_blank" rel="noopener noreferrer" className="text-blue-600 mt-2 inline-block">
//                 View Pitch Deck
//               </a>
//             )}
//           </div>
//         ) : (
//           <p>No entrepreneur details found.</p>
//         )}

//         {/* Investors Section */}
//         <h2 className="text-2xl font-semibold mt-8">Potential Investors</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
//           {investors.map((investor) => (
//             <div key={investor._id} className="p-4 bg-white shadow-md rounded-lg">
//               <h3 className="text-xl font-bold">{investor.name}</h3>
//               <p className="text-gray-600">Investment: ${investor.investmentCapacity}</p>
//               <button
//                 onClick={() => handlePitch(investor._id)}
//                 className="mt-3 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
//               >
//                 Pitch Idea
//               </button>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
