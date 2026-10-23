//  components/layout/checkout/ContactForm.tsx
interface Props {
  data: {
    email: string;
    phone: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  errors: Record<string, string>;
}
export default function ContactForm({ data, setFormData, errors }: Props) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-8">
      <h2 className="font-semibold mb-6">Contact Information</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">
            Email Address<span className="text-red-700 ms-1">*</span>
          </label>
          <input
            className="w-full mt-1 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">
            Phone Number<span className="text-red-700 ms-1">*</span>
          </label>
          <input
            className="w-full mt-1 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600 outline-none"
            placeholder="Phone"
            name="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
}
