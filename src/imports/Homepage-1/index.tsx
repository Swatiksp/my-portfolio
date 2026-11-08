function Frame() {
  return (
    <div className="content-stretch flex flex-col font-['Archivo:SemiBold',sans-serif] gap-[12px] items-start leading-[normal] relative shrink-0 text-[40px]">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] min-w-full relative shrink-0 w-[min-content]">HELLO!</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0 whitespace-nowrap">I’M SWATIK</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="[word-break:break-word] absolute content-stretch flex flex-col gap-[20px] items-start left-[-560px] not-italic text-black top-[192px] w-[518px]">
      <Frame />
      <p className="font-['Archivo:Regular',sans-serif] leading-[normal] min-w-full relative shrink-0 text-[16px] w-[min-content]">A UX designer crafting intuitive digital experiences that leverage emerging technologies, enhance usability, and create meaningful connections.</p>
      <div className="font-['Archivo:Regular',sans-serif] leading-[0] min-w-full relative shrink-0 text-[0px] w-[min-content]">
        <p className="font-['Archivo:Bold_Italic',sans-serif] italic leading-[normal] mb-0 text-[12px]">Previously at</p>
        <p className="leading-[normal] text-[16px]">Accenture</p>
      </div>
      <div className="font-['Archivo:Regular',sans-serif] leading-[0] min-w-full relative shrink-0 text-[0px] w-[min-content]">
        <p className="font-['Archivo:Bold_Italic',sans-serif] italic leading-[normal] mb-0 text-[12px]">Currently at</p>
        <p className="leading-[normal] text-[16px]">North Carolina State University #gowolfpack!</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="[word-break:break-word] content-stretch flex font-['Archivo:Regular',sans-serif] gap-[60px] items-center leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0">TO START OFF...</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0">MY CRAFT</p>
      <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] relative shrink-0">WHO AM I?</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch flex gap-[854px] h-[66px] items-center left-0 px-[80px] py-[25px] top-0">
      <div aria-hidden className="absolute border-[#c4c4c4] border-b-[0.4px] border-solid inset-0 pointer-events-none" />
      <div className="bg-black relative rounded-[2px] shrink-0 size-[16px]" />
      <Frame1 />
    </div>
  );
}

export default function Homepage() {
  return (
    <div className="bg-white relative size-full" data-name="Homepage">
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[375px] left-[80px] top-[127px] w-[619px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[375px] left-[80px] top-[590px] w-[619px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[375px] left-[80px] top-[1053px] w-[619px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[375px] left-[743px] top-[127px] w-[619px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[375px] left-[743px] top-[590px] w-[619px]" />
      <div className="absolute bg-[#d9d9d9] border-[#c4c4c4] border-[0.4px] border-solid h-[375px] left-[743px] top-[1053px] w-[619px]" />
      <Frame3 />
      <Frame2 />
    </div>
  );
}