/** @format */

import React from 'react';
import { Link } from 'react-router-dom';
import SVG from '../../assets/misc/undraw_void_-3-ggu.svg';

function Page404() {
	return (
		<div className="w-full h-full flex justify-center items-center text-primary-900">
			<div className="w-1/4 flex flex-col justify-center items-center p-4 rounded-lg gap-4">
				<img src={SVG} alt="404" className="w-1/2" />
				<div className="flex flex-row justify-center items-center text-center">
					<h1 className="text-2xl text-primary-900">
						Oops! You may want to go back{' '}
						<Link
							to="/"
							className="text-primary-900 font-bold bg-primary-300 rounded-lg text-center px-4 transition-all duration-300 ease-in-out hover:bg-primary-400">
							Home
						</Link>
					</h1>
				</div>
			</div>
		</div>
	);
}

export default Page404;
