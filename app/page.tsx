"use client"
import LiveRadioButton from './components/live-radio-button';
import Image from 'next/image';

import logo from './assets/logo_white_full.png';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image src={logo} alt="Xlair radio logo" width={288} />
        <Image src={logo} alt="Xlair radio logo" className="blur-xl opacity-35 absolute" width={288} />
        <div className="w-72 flex ">
        <p className="max-w-72 text-xs tracking-tighter">Xl Air is a platform for anyone who likes to <span className="font-bold">experiment</span> with <span className="font-bold">sound</span>. It is an acceccible multidisciplinary hotbed and it is also your playground.</p>
        </div>
        <div className="w-72 justify-center flex mt-6">
          <LiveRadioButton />
        </div>
      </main>
    </div>
  );
}
