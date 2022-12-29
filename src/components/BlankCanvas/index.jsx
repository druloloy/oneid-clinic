/** @format */

import SVG from '../../assets/misc/undraw_no_data_re_kwbl.svg';
function BlankCanvas({ message }) {
	return (
		<div className="w-full flex flex-col justify-center items-center gap-2">
			<img src={SVG} alt="No Data" className="w-1/3" />
			<p className="text-center text-md font-bold">{message}</p>
		</div>
	);
}

export default BlankCanvas;
