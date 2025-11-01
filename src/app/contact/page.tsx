"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Abhi ke liye, hum form data ko console par log karenge.
    // Aage hum ise email par bhej sakte hain.
    console.log({ name, email, message });
    toast.success("Your message has been sent successfully!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <>
      
      <main className="min-h-screen bg-gray-900 text-white pt-24 px-4 md:px-8">
        <div className="container mx-auto py-12">
          <h1 className="text-5xl font-bold text-center mb-12">Contact Us</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Details Section */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-6 text-blue-400">
                Get in Touch
              </h2>
              <div className="space-y-4 text-lg">
                <p>
                  <strong>Address:</strong> Pinkal, Sodla Tank Road, near Surya
                  Sangha Club, Garulia, West Bengal 743133
                </p>
                <p>
                  <strong>Email:</strong> contact@brillianceacademy.com
                </p>
                <p>
                  <strong>Phone:</strong> +91 7003437950
                </p>
                <a
                  href="https://maps.app.goo.gl/D2FHBXY713Supo6q6" // Yahan apni coaching ka Google Maps link daalein
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-blue-400 hover:text-blue-300 transition"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-semibold mb-6 text-blue-400">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-gray-700 rounded-md"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
