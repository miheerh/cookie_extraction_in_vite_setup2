import React from "react"
import flipcart from "../popup/pngimages/flipcart.png"
import jiomart from "../popup/pngimages/jio-mart-logo.png"
import meshow from "../popup/pngimages/meshow.png"
export default function Notificationlist() {
  return (
    <>
      {/*<!-- Component: One Line List With Trailing Checkbox And Leading Image --> */}
      <ul className="w-[400px] divide-y divide-slate-100">
        <li className="flex items-center gap-4 px-4 py-3">
          <div className="flex shrink-0 items-center self-center">
          
            <img
              src={flipcart}
              alt="product image"
              className="w-26 h-16 rounded"
            />
          </div>

          <div className="flex min-h-[2rem] min-w-0 flex-1 flex-col items-start justify-center gap-0">
            <label
              htmlFor="id-a13a"
              className="w-full cursor-pointer truncate text-base text-slate-700"
            >
              flipcart login
            </label>
          </div>
          <div className="flex items-center self-center">
            <div className="relative flex flex-wrap items-center">
            <button className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-gray-300 px-5 text-sm font-medium tracking-wide text-black transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none">
        <span>login</span>
      </button>
            </div>
          </div>
        </li>
        <li className="flex items-center gap-4 px-4 py-3">
          <div className="flex items-center self-center">
          <img
              src={jiomart}
              alt="product image"
              className="w-26 h-16 rounded"
            />
          </div>
          <div className="flex min-h-[2rem] min-w-0 flex-1 flex-col items-start justify-center gap-0">
            <label
              htmlFor="id-a13b"
              className="w-full cursor-pointer truncate text-base text-slate-700"
            >
              jiomart login
            </label>
          </div>
          <div className="flex items-center self-center">
            <div className="relative flex flex-wrap items-center">
            <button className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-gray-300 px-5 text-sm font-medium tracking-wide text-black transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none">
        <span>login</span>
      </button>
            </div>
          </div>
        </li>
        <li className="flex items-center gap-4 px-4 py-3">
          <div className="flex items-center self-center">
          <img
              src={meshow}
              alt="product image"
              className="w-26 h-16 rounded"
            />
          </div>
          <div className="flex min-h-[2rem] min-w-0 flex-1 flex-col items-start justify-center gap-0">
            <label
              htmlFor="id-a13c"
              className="w-full cursor-pointer truncate text-base text-slate-700"
            >
              meshow login
            </label>
          </div>
          <div className="flex items-center self-center">
            <div className="relative flex flex-wrap items-center">
            <button className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full bg-gray-300 px-5 text-sm font-medium tracking-wide text-black transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none">
        <span>login</span>
      </button>
            </div>
          </div>
        </li>
      </ul>
      {/*<!-- End One Line List With Trailing Checkbox And Leading Image --> */}
    </>
  )
}