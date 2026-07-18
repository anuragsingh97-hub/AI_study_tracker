import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Timer,
  Target,
  Coffee,
  X,
} from "lucide-react";

export default function StudySummaryModal({

  open,

  onClose,

  studyTime,

  pauseCount,

  focusScore,

}){

return(

<AnimatePresence>

{

open && (

<motion.div

initial={{opacity:0}}
animate={{opacity:1}}
exit={{opacity:0}}

className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"

>

<motion.div

initial={{scale:0.8}}
animate={{scale:1}}
exit={{scale:0.8}}

className="bg-slate-900 rounded-3xl p-8 w-[500px] border border-slate-700"

>

<div className="flex justify-between">

<div className="flex gap-3">

<Trophy className="text-yellow-400"/>

<h2 className="text-2xl text-white font-bold">

Session Summary

</h2>

</div>

<button onClick={onClose}>

<X className="text-white"/>

</button>

</div>

<div className="space-y-5 mt-8">

<Item
icon={<Timer/>}
title="Study Time"
value={`${Math.floor(studyTime / 60)}m ${studyTime % 60}s`}
/>

<Item
icon={<Coffee/>}
title="Breaks"
value={pauseCount}
/>

<Item
icon={<Target/>}
title="Focus Score"
value={`${focusScore}%`}
/>

</div>

<div className="mt-8">

<div className="w-full bg-slate-800 rounded-full h-4">

<div

style={{width:`${focusScore}%`}}

className="bg-green-500 h-4 rounded-full"

></div>

</div>

<p className="text-center mt-3 text-slate-300">

Excellent Work 🎉

</p>

</div>

<button

onClick={onClose}

className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-white"

>

Done

</button>

</motion.div>

</motion.div>

)

}

</AnimatePresence>

)

}

function Item({

icon,

title,

value,

}){

return(

<div className="flex justify-between items-center bg-slate-800 rounded-xl p-4">

<div className="flex gap-3 text-slate-300">

{icon}

{title}

</div>

<span className="text-white font-bold">

{value}

</span>

</div>

)

}
