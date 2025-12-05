import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const Agenda = () => {
    const [agendaList, setAgendaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAgenda = async () => {
            try {
                // const res = await axios.get(`${BASE_URL}/webinar`);
                const res = await axios.get(`${BASE_URL}/agenda`);
                setAgendaList(res.data);
            } catch (err) {
                console.error('Error fetching agenda:', err);
                setError('Failed to load agenda');
            } finally {
                setLoading(false);
            }
        };

        fetchAgenda();
    }, []);

    return (
        <section className="bg-gray-50 py-16 px-4 sm:px-8">
            <h2 className="text-3xl md:text-4xl text-center font-bold text-blue-700 mb-4">Webinar Agenda</h2>
            <p className="text-lg mb-10 text-center text-gray-600">Everything you need to know about our comprehensive career counselling session</p>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT: Dynamic Agenda List */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow">
                    {loading ? (
                        <p className="text-center">Loading agenda...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : (
                        <>
                            {agendaList.map((agenda, index) => (
                                <div key={index} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2">{agenda.title}</h3>
                                    <ul className="text-gray-700 space-y-1">
                                        <li>{agenda.part1}</li>
                                        <li>{agenda.part2}</li>
                                        <li>{agenda.part3}</li>
                                    </ul>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* RIGHT: Static Why This Webinar */}
                <div className="bg-blue-500 text-white p-6 sm:p-10 rounded-2xl shadow flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-6">Why This Webinar?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">✅</span>
                                Expert-led guidance from industry professionals
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">✅</span>
                                Interactive session with personalized insights
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">✅</span>
                                Actionable steps to advance your career
                            </li>
                            <li className="flex items-start">
                                <span className="text-2xl mr-3">✅</span>
                                Networking with like-minded professionals
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 text-center">
                        <a
                            href="#registration"
                            className="bg-white hover:bg-blue-200 px-6 py-2 rounded text-blue-600 font-semibold"
                        >
                            Reserve Your Spot
                        </a>
                        {/* <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-100 transition">
                            Reserve Your Spot
                        </button> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Agenda;
