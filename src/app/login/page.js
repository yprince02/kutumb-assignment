"use client";
import { Button, Card, Input } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import OTPInput from "react-otp-input";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    try {
      const { data } = await axios.post(
        "https://assignment.stage.crafto.app/login",
        {
          username: username?.trim(),
          otp: otp,
        }
      );
      if (data?.token) {
        localStorage.setItem("session-token", data?.token);
        router.push("/");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }, [otp, router, username]);

  return (
    <section className="login-container px-2">
      <Card className="py-6 px-4 flex flex-col gap-6 w-full">
        <h1 className="text-center font-bold">Login To Kutumb Quotes</h1>
        {activeStep === 0 ? (
          <>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              variant="bordered"
              className="rounded-lg"
              required
            />
            <Button
              onClick={() => {
                if (username?.trim()?.length) {
                  setActiveStep(1);
                } else {
                  toast.error("Enter a valid username.");
                }
              }}
              color="primary"
            >
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <OTPInput
              value={otp}
              onChange={(e) => {
                setOtp(e);
              }}
              numInputs={4}
              renderSeparator={<span>-</span>}
              renderInput={(props) => (
                <input
                  required
                  {...props}
                  className="border-medium rounded-lg"
                />
              )}
              containerStyle={{ justifyContent: "space-around" }}
              inputStyle={{ width: "50px", height: "50px", background: "" }}
            />
            <Button onClick={handleSubmit} color="primary">
              Verify OTP
            </Button>
          </>
        )}
      </Card>
    </section>
  );
}
