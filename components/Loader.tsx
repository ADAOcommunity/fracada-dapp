export const Loader = ({dark}: {dark? : boolean}) => <svg
  width="200px" height="200px"
  className="animate-spin w-14 h-14 mx-auto my-36 md:my-48 "
  preserveAspectRatio="xMidYMid" viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
>
  <circle
    cx="50" cy="50" fill="none" stroke={dark ? `#1F2937` : `#ffffff`} strokeWidth="10" r="35"
    strokeDasharray="164.93361431346415 56.97787143782138" transform="matrix(1,0,0,1,0,0)" />
</svg>;
