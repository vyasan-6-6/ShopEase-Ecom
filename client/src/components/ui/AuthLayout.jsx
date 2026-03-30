 
const AuthLayout = ({
  children,
  title,
  subtitle,
  sideContent, // optional (image, feature list, etc.)
}) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side (optional branding / features) */}
      <div className="hidden md:flex w-1/2 bg-black text-white items-center justify-center p-10">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold">ShopEase</h1>
          <p className="text-gray-300">
            Your one-stop destination for everything you need.
          </p>

          {sideContent}
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1 text-center">
            {title && (
              <h2 className="text-2xl font-semibold">{title}</h2>
            )}
            {subtitle && (
              <p className="text-gray-500 text-sm">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;