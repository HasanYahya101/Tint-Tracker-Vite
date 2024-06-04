import { Slider } from "@/components/ui/slider"

export function Viewer() {
  return (
    (<div
      className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-950">
      <div
        className="max-w-3xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="relative">
            <img
              alt="Uploaded Image"
              className="w-full h-full object-cover rounded-lg"
              height={500}
              src="/placeholder.svg"
              style={{
                aspectRatio: "500/500",
                objectFit: "cover",
              }}
              width={500} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-900 p-2 rounded-full shadow-lg">
                <EyeIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#ff0000]" />
              </div>
              <div className="flex-1 grid gap-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">HEX</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">#FF0000</div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Hue</div>
                <Slider className="flex-1" defaultValue={[0]} max={360} step={1} />
                <div
                  className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">0°</div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Saturation</div>
                <Slider className="flex-1" defaultValue={[100]} max={100} step={1} />
                <div
                  className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">100%</div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Brightness</div>
                <Slider className="flex-1" defaultValue={[100]} max={100} step={1} />
                <div
                  className="w-16 text-right text-sm font-medium text-gray-900 dark:text-gray-50">100%</div>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">RGB</div>
                <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-50">255, 0, 0</div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 text-right text-sm font-medium text-gray-500 dark:text-gray-400">HSL</div>
                <div className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-50">0°, 100%, 50%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  );
}

function EyeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>)
  );
}
