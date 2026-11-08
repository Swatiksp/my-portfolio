function Frame4() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[8px] italic items-end leading-[normal] relative shrink-0 text-black w-full whitespace-nowrap">
      <p className="font-['Playfair_Display:Bold_Italic',sans-serif] font-bold relative shrink-0 text-[24px]">01</p>
      <p className="font-['Playfair_Display:Italic',sans-serif] font-normal relative shrink-0 text-[20px] tracking-[0.8px]">Halo Conversations</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#969696] content-stretch flex items-center justify-center px-[10px] py-[5px] relative rounded-[2px] shrink-0">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">AI</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#969696] content-stretch flex items-center justify-center px-[10px] py-[5px] relative rounded-[2px] shrink-0">
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">Web Application</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-w-px relative">
      <Frame4 />
      <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[16px] text-black w-[min-content]">Powered by Microsoft Copilot, Halo Conversations bridges the gaps between sales teams and clients.</p>
      <Frame2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute content-stretch flex h-[137px] items-end left-[20.5px] right-[20.5px] top-[309.5px]">
      <Frame3 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#d9d9d9] drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] relative rounded-[2px] size-full" data-name="Component 1">
      <Frame5 />
      <div className="absolute bg-[#9b9999] h-[290px] left-0 rounded-[2px] top-0 w-[630px]" />
    </div>
  );
}