import React, { useState } from "react";
import router, { useRouter } from "next/router";
import Link from "next/link";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import { auth } from "../../config/firebase";
import "react-phone-input-2/lib/high-res.css";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import Loader from "../loader/Loader";

export default function Login() {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        router.push("/ambulance");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <>
      <section class="bg-white">
        <div class="grid h-screen grid-cols-1 lg:grid-cols-2">
          <div class="relative flex items-end px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-gray-50 sm:px-6 lg:px-8">
            <div class="absolute inset-0">
              <img
                class="object-cover w-full h-full"
                src="/images/bg2.png"
                alt=""
              />
            </div>
            <div class="absolute inset-0 bg-gradient-to-b from-[#06090729] to-transparent"></div>

            <div class="relative"></div>
          </div>

          <div class="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
            <div class="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2 class="text-3xl font-bold font-body leading-tight text-black sm:text-4xl p-4">
                Welcome to <img src="/logof.png" className="h-12 mt-3" />{" "}
              </h2>
              <Toaster toastOptions={{ duration: 4000 }} />
              <div id="recaptcha-container"></div>

              {user ? (
                <h2 className="text-center text-black font-medium text-2xl">
                  👍Login Success
                </h2>
              ) : (
                <div className="w-[100%] flex flex-col gap-4 rounded-lg p-4 ">
                  {showOTP ? (
                    <>
                      <div className="bg-white text-emerald-500 w-fit mx-auto p-4 pt-2 rounded-full"></div>
                      <label
                        htmlFor="otp"
                        className="font-bold text-xl text-black text-center"
                      >
                        Enter your OTP
                      </label>
                      <div className="bg-red-200 flex justify-center px-4 pl-8 p-3 rounded-lg">
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          autoFocus
                          OTPLength={6}
                          otpType="number"
                          disabled={false}
                          secure
                          className="border-black "
                        />
                      </div>

                      {/* <OtpInput
                      value={otp}
                      onChange={setOtp}
                      OTPLength={6}
                      otpType="number"
                      disabled={false}
                      autoFocus
                      className="opt-container border-black"
                    ></OtpInput> */}
                      <button
                        onClick={onOTPVerify}
                        className="bg-[#1e1240] w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                      >
                        {loading && <Loader />}
                        <span>Verify OTP</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div class="space-y-5">
                        <div>
                          <label
                            for=""
                            class="text-base font-medium text-gray-900"
                          >
                            Enter your mobile number
                          </label>
                          <div class="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <img
                                className="h-6 w-6"
                                src="https://img.icons8.com/ios/50/null/phone--v1.png"
                              />
                            </div>

                            <input
                              type="tel"
                              name=""
                              onChange={(event) => setPh(event.target.value)}
                              id=""
                              defaultValue="+91 "
                              placeholder=" Enter your number"
                              class="block w-full py-4 pl-10 pr-7 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-blue-600 focus:bg-white caret-blue-600"
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            onClick={onSignup}
                            class="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-fuchsia-600 to-blue-600 focus:outline-none hover:opacity-80 focus:opacity-80"
                          >
                            {loading && <Loader />}
                            {!loading && "Send OTP"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
