export default function FaceStatus({
    faceDetected,
}) {

return(

<div className="bg-slate-900 rounded-2xl p-6">

<h2 className="text-xl text-white">

AI Status

</h2>

<p className="mt-5 text-2xl">

{
faceDetected ?

"🟢 Focused"

:

"🔴 Face Missing"

}

</p>

</div>

)

}