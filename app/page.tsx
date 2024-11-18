"use client"
import LiveRadioButton from './components/LiveRadioButton';
import LiveChat from './components/LiveChat';
import Image from 'next/image';

import logo from './assets/logo_white_full.png';
import construction from './assets/construction.png';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image src={logo} alt="Xlair radio logo" width={288} height={0} />
        <Image src={logo} alt="Xlair radio logo" className="blur-xl opacity-35 absolute" width={288} height={0} />
        <div className="flex text-xs items-center justify-center tracking-tighter"> <Image src={construction} alt="constructio emoji" width={30} height={10}/> <p className="p-2">xlair.be is currently under construction</p> <Image src={construction} alt="constructio emoji" width={30} height={10}/></div> 
        <div className="w-72 flex flex-col">
          <p className="max-w-72 text-xs tracking-tighter text-center">Xl Air is a platform for anyone who likes to <span className="font-bold">experiment</span> with <span className="font-bold">sound</span>. It is an accessible multidisciplinary hotbed and it is also your playground.</p>
        </div>
        <div className="w-72 flex flex-col text-base text-blue-400">
          <a href='https://www.mixcloud.com/XLAIR/' target='_' className="max-w-72 text-md underline tracking-tighter text-center">Relisten on Mixcloud</a>
        </div>
        <div className="w-72 justify-center flex flex-col gap-8 mt-6">
          <LiveRadioButton />
          <LiveChat/>
        </div>
      </main>
    </div>
  );
}
