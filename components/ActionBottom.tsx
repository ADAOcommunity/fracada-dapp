import { HomeButton } from "./HomeButton";
import { Loader } from "./Loader";

export function ActionBottom({ state, enabled, action, successMsg, cta }: { state: string; enabled: boolean; action: () => void; successMsg: string; cta: string}) {
  return <div className="flex items-center justify-start">
    {state === 'Success' ?
      <div className="h-14 m-auto rounded-xl flex font-medium text-green-500 items-center justify-center">{successMsg}</div>
      :
      <button
        disabled={!enabled}
        className={`
          w-44 h-14 m-auto rounded-xl flex font-medium items-center justify-center
          ${enabled ?
            'text-white hover:scale-110 cursor-pointer ' + (state === 'Init' ? 'bg-green-500' : 'bg-orange-500') :
            'bg-gray-400 text-gray-300'}`}
        onClick={() => {
          action();
        }}
      >
        {state === 'Init' ?
          cta :
          <Loader />}
      </button>}
    <HomeButton />
  </div>;
}
