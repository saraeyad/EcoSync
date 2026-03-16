import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, MapPin, Zap, Thermometer, X } from "lucide-react";
import { useAppStore } from "../../../hooks/useStore.ts";
import type { Factory } from "../../../types/index.ts";
import { cn } from "../../../lib/utils.ts";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(3, "Location is required"),
  country: z.string().min(2, "Country is required"),
  status: z.enum(["online", "offline", "warning"]),
  efficiency: z.coerce.number().min(0).max(100),
  carbonCredit: z.coerce.number().min(0).max(100),
  carbonDensity: z.coerce.number().min(0).max(100),
  output: z.string().min(1, "Output is required"),
  temperature: z.coerce.number().min(-50).max(80),
  co2Saved: z.coerce.number().min(0),
  uptime: z.coerce.number().min(0).max(100),
  lng: z.coerce.number().min(-180).max(180),
  lat: z.coerce.number().min(-90).max(90),
});

type FormValues = z.infer<typeof schema>;

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, error, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-600">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <X size={10} /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  cn(
    "w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border text-sm text-slate-200 placeholder-slate-600",
    "focus:outline-none focus:ring-1 transition-all",
    hasError
      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
      : "border-slate-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/10",
  );

interface AddFactoryFormProps {
  onClose: () => void;
}

export function AddFactoryForm({ onClose }: AddFactoryFormProps) {
  const [success, setSuccess] = useState(false);
  const { addFactory } = useAppStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "online" as const,
      efficiency: 85,
      carbonCredit: 80,
      carbonDensity: 25,
      temperature: 22,
      uptime: 99,
      co2Saved: 5000,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    const typed = data as FormValues;
    const factory: Factory = {
      id: Date.now(),
      name: typed.name,
      location: typed.location,
      country: typed.country,
      status: typed.status,
      efficiency: typed.efficiency,
      carbonCredit: typed.carbonCredit,
      carbonDensity: typed.carbonDensity,
      output: typed.output,
      temperature: typed.temperature,
      co2Saved: typed.co2Saved,
      uptime: typed.uptime,
      coordinates: [typed.lng, typed.lat],
      energySeed: Math.floor(Math.random() * 1000),
    };
    await addFactory(factory);
    setSuccess(true);
    setTimeout(onClose, 1800);
  };

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <CheckCircle2 size={48} className="text-emerald-400" />
        </motion.div>
        <h3 className="text-white font-black text-xl">Factory Added!</h3>
        <p className="text-slate-400 text-sm">
          Your facility is now live in the network.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Facility Name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="e.g. Paris Solar Hub"
            className={inputCls(!!errors.name)}
          />
        </Field>
        <Field label="Status" error={errors.status?.message}>
          <select {...register("status")} className={inputCls(!!errors.status)}>
            <option value="online">Online</option>
            <option value="warning">Warning</option>
            <option value="offline">Offline</option>
          </select>
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <div className="relative">
            <MapPin
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              {...register("location")}
              placeholder="Paris, FR"
              className={cn(inputCls(!!errors.location), "pl-8")}
            />
          </div>
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <input
            {...register("country")}
            placeholder="France"
            className={inputCls(!!errors.country)}
          />
        </Field>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Longitude" error={errors.lng?.message} hint="-180 to 180">
          <input
            {...register("lng")}
            type="number"
            step="0.0001"
            placeholder="2.3522"
            className={inputCls(!!errors.lng)}
          />
        </Field>
        <Field label="Latitude" error={errors.lat?.message} hint="-90 to 90">
          <input
            {...register("lat")}
            type="number"
            step="0.0001"
            placeholder="48.8566"
            className={inputCls(!!errors.lat)}
          />
        </Field>
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Efficiency %" error={errors.efficiency?.message}>
          <div className="relative">
            <Zap
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              {...register("efficiency")}
              type="number"
              min={0}
              max={100}
              placeholder="85"
              className={cn(inputCls(!!errors.efficiency), "pl-8")}
            />
          </div>
        </Field>
        <Field label="Carbon Credit %" error={errors.carbonCredit?.message}>
          <input
            {...register("carbonCredit")}
            type="number"
            min={0}
            max={100}
            placeholder="80"
            className={inputCls(!!errors.carbonCredit)}
          />
        </Field>
        <Field label="Carbon Density %" error={errors.carbonDensity?.message}>
          <input
            {...register("carbonDensity")}
            type="number"
            min={0}
            max={100}
            placeholder="25"
            className={inputCls(!!errors.carbonDensity)}
          />
        </Field>
        <Field label="Output" error={errors.output?.message}>
          <input
            {...register("output")}
            placeholder="2.5 GW"
            className={inputCls(!!errors.output)}
          />
        </Field>
        <Field label="Temperature °C" error={errors.temperature?.message}>
          <div className="relative">
            <Thermometer
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              {...register("temperature")}
              type="number"
              placeholder="22"
              className={cn(inputCls(!!errors.temperature), "pl-8")}
            />
          </div>
        </Field>
        <Field label="Uptime %" error={errors.uptime?.message}>
          <input
            {...register("uptime")}
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="99.0"
            className={inputCls(!!errors.uptime)}
          />
        </Field>
        <Field label="CO₂ Saved (tons)" error={errors.co2Saved?.message}>
          <input
            {...register("co2Saved")}
            type="number"
            min={0}
            placeholder="5000"
            className={inputCls(!!errors.co2Saved)}
          />
        </Field>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 font-semibold text-sm transition-all"
        >
          Cancel
        </button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/40 text-slate-900 font-black text-sm transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} />
          Add to Network
        </motion.button>
      </div>
    </form>
  );
}
