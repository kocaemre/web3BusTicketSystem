"use client";

import { useState } from "react";
import React from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { CreditCardIcon } from "@heroicons/react/20/solid";
import {
  CalendarIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  TicketIcon,
  TvIcon,
  UserIcon,
  WifiIcon,
} from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(0);

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const { data: seatMap1 } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getSeatMap",
    args: [BigInt(0)],
  });

  const { data: busTickets1 } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "busTickets",
    args: [BigInt(0)],
  });

  const { data: seatMap2 } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getSeatMap",
    args: [BigInt(1)],
  });

  const { data: busTickets2 } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "busTickets",
    args: [BigInt(1)],
  });

  const { data: seatMap3 } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getSeatMap",
    args: [BigInt(2)],
  });

  const { data: busTickets3 } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "busTickets",
    args: [BigInt(2)],
  });

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="inline-flex mx-auto mt-10 items-center font-semibold text-5xl">
          <TicketIcon className="mr-2 mt-3 h-14" /> Welcome to ENS Bus!
        </div>
      </div>

      <div className="flex justify-center items-center mb-10">
        <div className="inline-flex mx-auto mt-16 items-center font-mono text-3xl">
          <MagnifyingGlassIcon className="mr-2 h-12" /> Please select a route
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-4 mx-auto">
        {/* Bus Ticket Card 1 */}
        <div className="collapse collapse-arrow bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title bg-base-100 mx-auto cursor-pointer">
            <div className="card-body flex flex-col md:flex-row justify-between items-center p-4">
              <div className="flex items-center mb-2 md:mb-0">
                <h2 className="card-title text-2xl font-bold">
                  {
                    <div>
                      {busTickets1?.[0]?.toString()} → {busTickets1?.[1]?.toString()}
                    </div> //where to where
                  }
                </h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex">
                  <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
                  {
                    <div>{busTickets1?.[2]?.toString()}</div> //date
                  }
                </div>
                <div className="flex">
                  <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
                  {
                    <div>{busTickets1?.[3]?.toString()}</div> //duraiton
                  }
                </div>
                <div className="flex">
                  <UserIcon
                    className={`h-6 w-6 mr-2 ${
                      busTickets1?.[6]?.toString() === "0" ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  {
                    <div>{busTickets1?.[6]?.toString()}</div> //left seats
                  }
                </div>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <div className="flex">
                  <TvIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-2">TV</span>
                </div>
                <div className="flex">
                  <WifiIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-2">WiFi</span>
                </div>
                <div className="flex">
                  <CreditCardIcon className="h-6 w-6 text-blue-500" />
                  {<span className="ml-2"> {formatEther(busTickets1?.[4] || 0n)} ETH</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="collapse-content bg-base-100 text-primary-content">
            <div className="flex justify-center items-center">
              <div className="mx-auto my-5 items-center font-bold text-2xl">Seat map</div>
            </div>
            {
              <div className="flex flex-wrap justify-start">
                {seatMap1?.map((seat, index) =>
                  index === 0 ? null : (
                    <div key={index} className="w-1/4 p-1">
                      {seat.toString() === "true" ? (
                        <button className="btn btn-sm w-full mb-1" disabled>
                          {index}
                        </button>
                      ) : (
                        <button className="btn btn-sm active w-full mb-1" onClick={() => setSelectedSeat(index)}>
                          {index}
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            }
            <div className="font-bold mt-2 justify-center items-center flex text-2xl">
              {selectedSeat ? (
                <p>You have selected {selectedSeat}</p>
              ) : (
                <p>You didnt select a seat.Please select a seat</p>
              )}
            </div>

            <div className="my-10 flex justify-center items-center">
              <button
                type="submit"
                className="btn btn-info"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "bookTicket",
                      args: [
                        selectedSeat !== null ? BigInt(selectedSeat) : undefined,
                        selectedSeat !== null ? BigInt(0) : undefined,
                      ],
                      value: parseEther("0.001"),
                    });
                  } catch (e) {
                    console.error("Error:", e);
                  }
                }}
              >
                Buy 🎫
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-4 mx-auto my-4">
        {/* Bus Ticket Card 2*/}
        <div className="collapse collapse-arrow bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title bg-base-100 mx-auto cursor-pointer">
            <div className="card-body flex flex-col md:flex-row justify-between items-center p-4">
              <div className="flex items-center mb-2 md:mb-0">
                <h2 className="card-title text-2xl font-bold">
                  {
                    <div>
                      {busTickets2?.[0]?.toString()} → {busTickets2?.[1]?.toString()}
                    </div> //where to where
                  }
                </h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex">
                  <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
                  {
                    <div>{busTickets2?.[2]?.toString()}</div> //date
                  }
                </div>
                <div className="flex">
                  <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
                  {
                    <div>{busTickets2?.[3]?.toString()}</div> //duraiton
                  }
                </div>
                <div className="flex">
                  <UserIcon
                    className={`h-6 w-6 mr-2 ${
                      busTickets2?.[6]?.toString() === "0" ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  {
                    <div>{busTickets2?.[6]?.toString()}</div> //left seats
                  }
                </div>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <div className="flex">
                  <TvIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-2">TV</span>
                </div>
                <div className="flex">
                  <WifiIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-2">WiFi</span>
                </div>
                <div className="flex">
                  <CreditCardIcon className="h-6 w-6 text-blue-500" />
                  {<span className="ml-2"> {formatEther(busTickets2?.[4] || 0n)} ETH</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="collapse-content bg-base-100 text-primary-content">
            <div className="flex justify-center items-center">
              <div className="mx-auto my-5 items-center font-bold text-2xl">Seat map</div>
            </div>
            {
              <div className="flex flex-wrap justify-start">
                {seatMap2?.map((seat, index) =>
                  index === 0 ? null : (
                    <div key={index} className="w-1/4 p-1">
                      {seat.toString() === "true" ? (
                        <button className="btn btn-sm w-full mb-1" disabled>
                          {index}
                        </button>
                      ) : (
                        <button className="btn btn-sm active w-full mb-1" onClick={() => setSelectedSeat(index)}>
                          {index}
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            }
            <div className="font-bold mt-2 justify-center items-center flex text-2xl">
              {selectedSeat ? (
                <p>You have selected {selectedSeat}</p>
              ) : (
                <p>You didnt select a seat.Please select a seat</p>
              )}
            </div>

            <div className="my-10 flex justify-center items-center">
              <button
                type="submit"
                className="btn btn-info"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "bookTicket",
                      args: [
                        selectedSeat !== null ? BigInt(selectedSeat) : undefined,
                        selectedSeat !== null ? BigInt(1) : undefined,
                      ],
                      value: parseEther("0.001"),
                    });
                  } catch (e) {
                    console.error("Error:", e);
                  }
                }}
              >
                Buy 🎫
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl space-y-4 mx-auto">
        {/* Bus Ticket Card 3*/}
        <div className="collapse collapse-arrow bg-base-100">
          <input type="checkbox" className="peer" />
          <div className="collapse-title bg-base-100 mx-auto cursor-pointer">
            <div className="card-body flex flex-col md:flex-row justify-between items-center p-4">
              <div className="flex items-center mb-2 md:mb-0">
                <h2 className="card-title text-2xl font-bold">
                  {
                    <div>
                      {busTickets3?.[0]?.toString()} → {busTickets3?.[1]?.toString()}
                    </div> //where to where
                  }
                </h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex">
                  <CalendarIcon className="h-6 w-6 text-blue-500 mr-2" />
                  {
                    <div>{busTickets3?.[2]?.toString()}</div> //date
                  }
                </div>
                <div className="flex">
                  <ClockIcon className="h-6 w-6 text-blue-500 mr-2" />
                  {
                    <div>{busTickets3?.[3]?.toString()}</div> //duraiton
                  }
                </div>
                <div className="flex">
                  <UserIcon
                    className={`h-6 w-6 mr-2 ${
                      busTickets3?.[6]?.toString() === "0" ? "text-red-500" : "text-blue-500"
                    }`}
                  />
                  {
                    <div>{busTickets3?.[6]?.toString()}</div> //left seats
                  }
                </div>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <div className="flex">
                  <TvIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-2">TV</span>
                </div>
                <div className="flex">
                  <WifiIcon className="h-6 w-6 text-blue-500" />
                  <span className="ml-2">WiFi</span>
                </div>
                <div className="flex">
                  <CreditCardIcon className="h-6 w-6 text-blue-500" />
                  {<span className="ml-2"> {formatEther(busTickets3?.[4] || 0n)} ETH</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="collapse-content bg-base-100 text-primary-content">
            <div className="flex justify-center items-center">
              <div className="mx-auto my-5 items-center font-bold text-2xl">Seat map</div>
            </div>
            {
              <div className="flex flex-wrap justify-start">
                {seatMap3?.map((seat, index) =>
                  index === 0 ? null : (
                    <div key={index} className="w-1/4 p-1">
                      {seat.toString() === "true" ? (
                        <button className="btn btn-sm w-full mb-1" disabled>
                          {index}
                        </button>
                      ) : (
                        <button className="btn btn-sm active w-full mb-1" onClick={() => setSelectedSeat(index)}>
                          {index}
                        </button>
                      )}
                    </div>
                  ),
                )}
              </div>
            }
            <div className="font-bold mt-2 justify-center items-center flex text-2xl">
              {selectedSeat ? (
                <p>You have selected {selectedSeat}</p>
              ) : (
                <p>You didnt select a seat.Please select a seat</p>
              )}
            </div>

            <div className="my-10 flex justify-center items-center">
              <button
                type="submit"
                className="btn btn-info"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "bookTicket",
                      args: [
                        selectedSeat !== null ? BigInt(selectedSeat) : undefined,
                        selectedSeat !== null ? BigInt(2) : undefined,
                      ],
                      value: parseEther("0.001"),
                    });
                  } catch (e) {
                    console.error("Error:", e);
                  }
                }}
              >
                Buy 🎫
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
