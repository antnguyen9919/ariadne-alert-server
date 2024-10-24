"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { updatePhone } from "@/app/_actions";
import { format } from "date-fns";

const PhoneForm: React.FC<{
  phone_number: string;
  updated_at: number;
}> = ({ phone_number, updated_at }) => {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(phone_number);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await updatePhone(phoneNumber);
    setLoading(false);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className='grid w-full max-w-md items-center gap-1.5'>
          <Label htmlFor='phone_number'>Phone Number</Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            id='phone_number'
            name='phone_number'
            type='text'
          />
          <div>
            Updated at:{" "}
            {format(new Date(updated_at * 1000), "yyyy-MM-dd HH:mm:ss")}
          </div>
        </div>
        <div className='mt-3 w-full'>
          <Button disabled={loading} type='submit' className='w-full'>
            {loading ? "Loading..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PhoneForm;
