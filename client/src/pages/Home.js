import { CiSearch, CiMail } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Home() {
    const navigate = useNavigate();
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 6;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:4000/");
                const data = await response.json();

                if (response.ok) {
                    setCourse(data);
                } else {
                    console.error("Failed to fetch posts:", data.message);
                }
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("auth_token");
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    setUser(decoded);
                } catch (err) {
                    console.error("Error decoding JWT:", err);
                }
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("auth_token");
        navigate("/login");
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCourses = course.filter(courseItem =>
        courseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        courseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleEnroll = async (course_id) => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            alert("You need to log in to enroll.");
            navigate("/login");
            return;
        }

        if (enrolledCourses.has(course_id)) {
            alert("You are already enrolled in this course.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/enrollment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: user.userId, course_id }),
            });

            const data = await response.json();

            if (response.ok) {
                setEnrolledCourses((prevEnrolledCourses) => new Set(prevEnrolledCourses).add(course_id));
                alert("You have successfully enrolled in the course!");
            } else {
                console.error("Failed to enroll:", data.message);
                alert("Error enrolling in course. Please try again.");
            }
        } catch (err) {
            console.error("Error enrolling in course:", err);
            alert("Error enrolling in course. Please try again.");
        }
    };

    const handleRemoveCourse = async (course_id) => {
        const token = localStorage.getItem("auth_token");

        try {
            const response = await fetch(`http://localhost:4000/enrollment`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: user.userId, course_id }),
            });

            const data = await response.json();

            if (response.ok) {
                setEnrolledCourses((prevEnrolledCourses) => {
                    const newEnrolledCourses = new Set(prevEnrolledCourses);
                    newEnrolledCourses.delete(course_id);
                    return newEnrolledCourses;
                });
                alert("Course removed successfully.");
            } else {
                console.error("Failed to remove course:", data.message);
                alert("Error removing course. Please try again.");
            }
        } catch (err) {
            console.error("Error removing course:", err);
            alert("Error removing course. Please try again.");
        }
    };

    const handleFinishCourse = async (course_id) => {
        const token = localStorage.getItem("auth_token");

        try {
            const response = await fetch(`http://localhost:4000/enrollment`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: user.userId, course_id, status: "finished" }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Course status updated to 'finished'.");
            } else {
                console.error("Failed to update course status:", data.message);
                alert("Error updating course status. Please try again.");
            }
        } catch (err) {
            console.error("Error updating course status:", err);
            alert("Error updating course status. Please try again.");
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredCourses.length / coursesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="bg-white h-full">
            <div className="flex flex-col lg:flex-row w-full h-screen">
                <div className="flex-1 h-full">
                    <header className="bg-white p-4 mb-4 shadow-md">
                        <div className="flex items-center w-full mx-auto">
                            <div className="flex items-center">
                                <img
                                    src="/logoadv.jpg"
                                    alt="Company Logo"
                                    className="h-16"
                                />
                                <h1 className="text-gray-600 text-[1.8rem] font-bold ml-10">
                                    LEARNING MANAGEMENT SYSTEM
                                </h1>
                            </div>
                            <div className="ml-32 flex items-center">
                                <div className="relative flex items-center">
                                    <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Search by title or description..."
                                        className="bg-white pl-10 p-2 w-96 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    />
                                    <div className="ml-4 flex items-center space-x-4">
                                        <IoIosNotificationsOutline className="text-gray-600" size={20} />
                                        <CiMail className="text-gray-600" size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex h-full gap-4">
                        <div className="bg-[#211C84] w-full lg:w-1/6 h-full flex flex-col items-center py-8 rounded-tr-3xl">
                            <h1 className="text-white text-3xl mb-8">Dashboard</h1>
                            <div className="flex flex-col items-start space-y-4 text-white w-full pl-6">
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Dashboard</button>
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Module</button>
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Peserta</button>
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Groupchat</button>
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Pemateri</button>

                                <hr className="border-t border-white w-full my-4" />

                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Profile</button>
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Settings</button>
                                <button className="w-full text-left p-2 hover:bg-white hover:text-black rounded">Calendar</button>
                                <button
                                    className="w-full text-left p-2 hover:bg-white hover:text-black rounded"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>

                        <div className="bg-white w-full h-full flex-col items-center justify-center mr-4 p-4">
                            {loading ? (
                                <p className="text-white text-2xl">Loading posts...</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl p-4">
                                    {currentCourses.map((courseItem) => (
                                        <div
                                            key={courseItem.course_id}
                                            className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
                                        >
                                            <h2 className="text-xl font-bold text-gray-800">{courseItem.title}</h2>
                                            <p className="text-gray-600 mt-2">{courseItem.description}</p>
                                            <p className="text-gray-500 mt-2">Course Type: {courseItem.course_type}</p>
                                            <p className="text-gray-500 mt-1">Instructor: {courseItem.instructor_name}</p>
                                            <p className="text-gray-500 mt-1">Start Date: {new Date(courseItem.course_date).toLocaleDateString()}</p>

                                            <button
                                                className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                onClick={() => handleEnroll(courseItem.course_id)}
                                                disabled={enrolledCourses.has(courseItem.course_id)}
                                            >
                                                {enrolledCourses.has(courseItem.course_id) ? "Enrolled" : "Enroll"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 flex justify-center">
                                <nav>
                                    <ul className="flex space-x-4">
                                        {pageNumbers.map((number) => (
                                            <li key={number}>
                                                <button
                                                    onClick={() => paginate(number)}
                                                    className={`py-2 px-4 rounded ${currentPage === number ? "bg-blue-500 text-white" : "bg-white text-blue-500"} hover:bg-blue-600 hover:text-white`}
                                                >
                                                    {number}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <div className="bg-white w-full lg:w-3/12 p-4 h-full">
                            <div className="flex flex-col items-center justify-center h-full">
                                <img
                                    src={user?.profilePic || "/blank.png"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4"
                                />
                                <h2 className="text-black text-2xl mb-4">
                                    SELAMAT DATANG, {user ? user.name : "User"}
                                </h2>
                                {enrolledCourses.size > 0 ? (
                                    [...enrolledCourses].map((course_id) => (
                                        <div
                                            key={course_id}
                                            className="bg-white p-4 m-2 rounded-lg shadow-lg border border-gray-200 w-full h-48 flex flex-col items-center justify-center"
                                        >
                                            <p className="text-gray-500">Course {course_id} enrolled</p>
                                            <div className="mt-4 flex space-x-4">
                                                <button
                                                    onClick={() => handleRemoveCourse(course_id)}
                                                    className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                                                >
                                                    Remove
                                                </button>
                                                <button
                                                    onClick={() => handleFinishCourse(course_id)}
                                                    className="py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    Finish
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white">You have not enrolled in any courses yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
