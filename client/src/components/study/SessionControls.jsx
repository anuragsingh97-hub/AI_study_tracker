export default function SessionControls({

    onStart,
    onPause,
    onResume,
    onEnd,

}){

return(

<div className="flex gap-4 mt-6">

<button
onClick={onStart}
className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl">

Start

</button>

<button
onClick={onPause}
className="bg-yellow-500 px-6 py-3 rounded-xl">

Pause

</button>

<button
onClick={onResume}
className="bg-green-600 px-6 py-3 rounded-xl">

Resume

</button>

<button
onClick={onEnd}
className="bg-red-600 px-6 py-3 rounded-xl">

End

</button>

</div>

)

}