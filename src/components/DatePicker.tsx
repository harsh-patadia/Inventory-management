import React, { useState, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";

interface DatePickerProps {
  value?: string; // milliseconds in string format
  onChange?: (value: string) => void;
  timeAllowed?: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  timeAllowed = false,
  label = "Date & Time",
  required = false,
  disabled = false,
  error = false,
  className = ""
}: DatePickerProps): React.ReactElement {

  const sxForField = {
    input: { color: 'var(--color-text)' }, // text color
    '& .MuiInputBase-input': { color: 'var(--color-text)' }, // ensure it works for all variants
    '& .MuiInputBase-input::placeholder': { color: 'var(--color-text)', opacity: 0.6 }
  }
  
  const parseInitialValue = (millisecondsStr: string | undefined) => {
    if (!millisecondsStr) return { date: "", time: "" };
    const ms = parseInt(millisecondsStr);
    const date = new Date(ms);
    if (isNaN(date.getTime())) return { date: "", time: "" };
    return {
      date: date.toISOString().split("T")[0],
      time: date.toTimeString().slice(0, 5)
    };
  };

  const [dateValue, setDateValue] = useState(parseInitialValue(value).date);
  const [timeValue, setTimeValue] = useState(parseInitialValue(value).time);
  const [allowTime, setAllowTime] = useState(timeAllowed);

  useEffect(() => {
    const parsed = parseInitialValue(value);
    setDateValue(parsed.date);
    setTimeValue(parsed.time);
  }, [value]);

  useEffect(() => {
    setAllowTime(timeAllowed);
  }, [timeAllowed]);

  const convertToMilliseconds = (date: string, time: string): string => {
    if (!date) return "";
    const dateTimeStr = `${date}T${allowTime && time ? time : "00:00"}:00`;
    return new Date(dateTimeStr).getTime().toString();
  };

  const handleDateChange = (newDate: string) => {
    setDateValue(newDate);
    onChange?.(convertToMilliseconds(newDate, timeValue));
  };

  const handleTimeChange = (newTime: string) => {
    setTimeValue(newTime);
    onChange?.(convertToMilliseconds(dateValue, newTime));
  };

  return (
    <Box className={`w-full space-y-3 sm:space-y-4 ${className}`}>
      {/* Label */}
      <Typography variant="body1" className="text-text font-medium">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </Typography>

      {/* Date & Time Fields */}
      <Box
        className={`grid gap-2 grid-cols-1 sm:gap-4`}
      >
        {/* Date */}
        <TextField
          type="date"
          value={dateValue}
          onChange={(e) => handleDateChange(e.target.value)}
          disabled={disabled}
          error={error}
          fullWidth
          size="small"
          sx={sxForField}
        />

        {/* Time */}
        {allowTime && (
          <TextField
            type="time"
            className="text-white placeholder:text-white"
            value={timeValue}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={disabled}
            error={error}
            fullWidth
            size="small"
            sx={sxForField}
          />
        )}
      </Box>
    </Box>
  );
}
