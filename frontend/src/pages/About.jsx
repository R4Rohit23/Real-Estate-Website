import React from "react";

function About() {
  return (
    <div className="min-h-screen dark:bg-slate-800 pt-10">
      <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-slate-800 dark:text-slate-400">
          About{" "}
          <span className="italic dark:text-slate-200">Skyline Estate</span>
        </h1>
        <p className="mb-4 text-slate-700 dark:text-slate-300 sm:text-lg">
          Skyline Estate is a leading real estate agency that specializes in
          helping clients buy, sell, and rent properties in the most desirable
          neighborhoods. Our team of experienced agents is dedicated to
          providing exceptional service and making the buying and selling
          process as smooth as possible.
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 sm:text-lg">
          Our mission is to help our clients achieve their real estate goals by
          providing expert advice, personalized service, and a deep
          understanding of the local market. Whether you are looking to buy,
          sell, or rent a property, we are here to help you every step of the
          way.
        </p>
        <p className="mb-4 text-slate-700 dark:text-slate-300 sm:text-lg">
          Our team of agents has a wealth of experience and knowledge in the
          real estate industry, and we are committed to providing the highest
          level of service to our clients. We believe that buying or selling a
          property should be an exciting and rewarding experience, and we are
          dedicated to making that a reality for each and every one of our
          clients.
        </p>
      </div>
    </div>
  );
}

export default About;
