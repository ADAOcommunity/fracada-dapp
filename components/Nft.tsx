export const Nft = ({ unit, image, assetName, policyId }: { unit: string | null, image: string | null, assetName: string | null, policyId: string | undefined, }) => {
  return <div className="flex flex-col items-center">
    {image ?
      <img className="w-80 h-80 rounded-lg drop-shadow-sm hover:scale-105" src={image}></img>
      :
      <div className="w-80 h-80 animate-pulse rounded-lg drop-shadow-sm bg-gray-300 hover:scale-105"></div>}
    <div className="w-80 break-all">
      <a target={'_blank'} rel="noreferrer" href={`https://cardanoscan.io/token/${unit}`}>
        <h4 className="text-gray-800 font-bold my-3 cursor-pointer hover:scale-105">{assetName}</h4>
      </a>
      <a target={'_blank'} rel="noreferrer" href={`https://cardanoscan.io/tokenPolicy/${policyId}`}>
        <p className="text-gray-800 text-sm cursor-pointer hover:scale-110">{policyId}</p>
      </a>
    </div>
  </div>;
};
