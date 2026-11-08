function Heading() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:SemiBold',sans-serif] leading-[40px] not-italic relative shrink-0 text-[40px] text-black whitespace-nowrap">HELLO!</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 1">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:SemiBold',sans-serif] leading-[40px] not-italic relative shrink-0 text-[40px] text-black whitespace-nowrap">{`I'M SWATIK`}</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Heading />
        <Heading1 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[26px] not-italic relative shrink-0 text-[16px] text-black w-[518px]">A UX designer crafting intuitive digital experiences that leverage emerging technologies, enhance usability, and create meaningful connections.</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Previously at</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">Accenture</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Currently at</p>
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Regular',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">North Carolina State University #gowolfpack!</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Paragraph4 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[80px] top-[126px] w-[518px]" data-name="Container">
      <Container2 />
      <Paragraph />
      <Container3 />
      <Container4 />
    </div>
  );
}

function Card() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[105px] relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[190px]" data-name="Card" />;
}

function Paragraph5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Project 06</p>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col h-[105px] items-start justify-end left-0 p-[20.5px] top-0 w-[190px]" data-name="Card">
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
      <Paragraph5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[105px] relative w-[190px]" data-name="Container">
      <div className="absolute flex h-[105px] items-center justify-center left-0 top-0 w-[190px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card />
        </div>
      </div>
      <Card1 />
    </div>
  );
}

function ContainerTransform() {
  return (
    <div className="h-[105px] relative shrink-0 w-[190px]" data-name="Container (transform)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="absolute flex h-[105px] items-center justify-center left-[-0.34px] top-0 w-[190px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Container6 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col h-[105px] items-start left-[1269.33px] top-[36px] w-[189.664px]" data-name="Container">
      <ContainerTransform />
    </div>
  );
}

function Card2() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[138px] relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[248px]" data-name="Card" />;
}

function Paragraph6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Project 05</p>
      </div>
    </div>
  );
}

function Card3() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col h-[138px] items-start justify-end left-0 p-[20.5px] top-0 w-[248px]" data-name="Card">
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
      <Paragraph6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[138px] relative w-[248px]" data-name="Container">
      <div className="absolute flex h-[138px] items-center justify-center left-0 top-0 w-[248px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card2 />
        </div>
      </div>
      <Card3 />
    </div>
  );
}

function ContainerTransform1() {
  return (
    <div className="h-[138px] relative shrink-0 w-[248px]" data-name="Container (transform)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="absolute flex h-[138px] items-center justify-center left-[0.02px] top-0 w-[248px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Container8 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[138px] items-start left-[1130.72px] top-[122px] w-[248.023px]" data-name="Container">
      <ContainerTransform1 />
    </div>
  );
}

function Card4() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[174px] relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[314px]" data-name="Card" />;
}

function Paragraph7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Project 04</p>
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col h-[174px] items-start justify-end left-0 p-[20.5px] top-0 w-[314px]" data-name="Card">
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
      <Paragraph7 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[174px] relative w-[314px]" data-name="Container">
      <div className="absolute flex h-[174px] items-center justify-center left-0 top-0 w-[314px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card4 />
        </div>
      </div>
      <Card5 />
    </div>
  );
}

function ContainerTransform2() {
  return (
    <div className="h-[174px] relative shrink-0 w-[314px]" data-name="Container (transform)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="absolute flex h-[174px] items-center justify-center left-[-0.32px] top-0 w-[314px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Container10 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col h-[174px] items-start left-[962.94px] top-[226px] w-[313.68px]" data-name="Container">
      <ContainerTransform2 />
    </div>
  );
}

function Card6() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[227px] relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[409px]" data-name="Card" />;
}

function Paragraph8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Project 03</p>
      </div>
    </div>
  );
}

function Card7() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col h-[227px] items-start justify-end left-0 p-[20.5px] top-0 w-[409px]" data-name="Card">
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
      <Paragraph8 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[227px] relative w-[409px]" data-name="Container">
      <div className="absolute flex h-[227px] items-center justify-center left-0 top-0 w-[409px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card6 />
        </div>
      </div>
      <Card7 />
    </div>
  );
}

function ContainerTransform3() {
  return (
    <div className="h-[227px] relative shrink-0 w-[409px]" data-name="Container (transform)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="absolute flex h-[227px] items-center justify-center left-[-0.48px] top-0 w-[409px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Container12 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col h-[227px] items-start left-[744.09px] top-[340px] w-[408.516px]" data-name="Container">
      <ContainerTransform3 />
    </div>
  );
}

function Card8() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[300px] relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[540px]" data-name="Card" />;
}

function Paragraph9() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Project 02</p>
      </div>
    </div>
  );
}

function Card9() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col h-[300px] items-start justify-end left-0 p-[20.5px] top-0 w-[540px]" data-name="Card">
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
      <Paragraph9 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[300px] relative w-[540px]" data-name="Container">
      <div className="absolute flex h-[300px] items-center justify-center left-0 top-0 w-[540px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card8 />
        </div>
      </div>
      <Card9 />
    </div>
  );
}

function ContainerTransform4() {
  return (
    <div className="h-[300px] relative shrink-0 w-[540px]" data-name="Container (transform)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="absolute flex h-[300px] items-center justify-center left-[-0.17px] top-0 w-[540px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Container14 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute content-stretch flex flex-col h-[300px] items-start left-[379.34px] top-[440px] w-[539.828px]" data-name="Container">
      <ContainerTransform4 />
    </div>
  );
}

function Card10() {
  return <div className="bg-[#d9d9d9] border-[#c4c4c4] border-[0.5px] border-solid h-[324px] relative shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] w-[584px]" data-name="Card" />;
}

function Paragraph10() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Archivo:Bold_Italic',sans-serif] italic leading-[18px] relative shrink-0 text-[12px] text-black whitespace-nowrap">Project 01</p>
      </div>
    </div>
  );
}

function Card11() {
  return (
    <div className="absolute bg-[#d9d9d9] content-stretch drop-shadow-[0px_0px_2px_rgba(0,0,0,0.25)] flex flex-col h-[324px] items-start justify-end left-0 p-[20.5px] top-0 w-[584px]" data-name="Card">
      <div aria-hidden className="absolute border-[#c4c4c4] border-[0.5px] border-solid inset-0 pointer-events-none" />
      <Paragraph10 />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[324px] relative w-[584px]" data-name="Container">
      <div className="absolute flex h-[324px] items-center justify-center left-0 top-0 w-[584px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <Card10 />
        </div>
      </div>
      <Card11 />
    </div>
  );
}

function ContainerTransform5() {
  return (
    <div className="h-[324px] relative shrink-0 w-[584px]" data-name="Container (transform)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="absolute flex h-[324px] items-center justify-center left-[-0.41px] top-0 w-[584px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Container16 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex flex-col h-[324px] items-start left-[-21.88px] top-[550px] w-[583.594px]" data-name="Container">
      <ContainerTransform5 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[961px] left-0 overflow-clip right-0 top-0" data-name="Container">
      <Container1 />
      <Container5 />
      <Container7 />
      <Container9 />
      <Container11 />
      <Container13 />
      <Container15 />
    </div>
  );
}

function App() {
  return (
    <div className="h-[961px] relative shrink-0 w-[1459px]" data-name="App">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Container17() {
  return <div className="bg-black relative rounded-[2px] shrink-0 size-[16px]" data-name="Container" />;
}

function Link() {
  return (
    <div className="h-[24px] relative shrink-0 w-[124.063px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Archivo:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-black top-[4px] whitespace-nowrap">TO START OFF...</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[80.352px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Archivo:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-black top-[4px] whitespace-nowrap">MY CRAFT</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[83.844px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="[word-break:break-word] absolute font-['Archivo:Regular',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-black top-[4px] whitespace-nowrap">WHO AM I?</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[60px] items-center relative size-full">
        <Link />
        <Link1 />
        <Link2 />
      </div>
    </div>
  );
}

function Homepage() {
  return (
    <div className="absolute bg-[#d9d9d9] h-[66px] left-0 top-0 w-[1459px]" data-name="Homepage">
      <div aria-hidden className="absolute border-[#c4c4c4] border-b-[0.5px] border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[0.5px] px-[80px] relative size-full">
        <Container17 />
        <Container18 />
      </div>
    </div>
  );
}

export default function Ref() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative size-full" data-name="Ref 1">
      <App />
      <Homepage />
    </div>
  );
}