import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
	"Titosy Manankasina — Développeur Fullstack JavaScript & Flutter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
	return new ImageResponse(
		<div
			style={{
				width: "1200px",
				height: "630px",
				display: "flex",
				flexDirection: "column",
				background: "#B2BDA0",
				position: "relative",
				overflow: "hidden",
				fontFamily: "sans-serif",
			}}
		>
			{/* Diagonal stripe pattern background */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage:
						"repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 40px)",
				}}
			/>

			{/* Watermark */}
			<div
				style={{
					position: "absolute",
					bottom: "30px",
					right: "-20px",
					fontSize: "120px",
					fontWeight: 900,
					color: "rgba(0,0,0,0.06)",
					letterSpacing: "0.1em",
					textTransform: "uppercase",
					display: "flex",
				}}
			>
				PORTFOLIO
			</div>

			{/* Main card */}
			<div
				style={{
					margin: "50px",
					flex: 1,
					background: "#F9FAF7",
					border: "4px solid #000",
					boxShadow: "10px 10px 0px #000",
					display: "flex",
					flexDirection: "column",
					padding: "50px 60px",
					position: "relative",
				}}
			>
				{/* Available badge */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "8px",
						marginBottom: "24px",
					}}
				>
					<div
						style={{
							width: "10px",
							height: "10px",
							borderRadius: "50%",
							background: "#22c55e",
							border: "2px solid #000",
							display: "flex",
						}}
					/>
					<span
						style={{
							fontSize: "16px",
							fontWeight: 700,
							textTransform: "uppercase",
							letterSpacing: "0.15em",
							border: "2px solid #000",
							padding: "4px 12px",
							display: "flex",
						}}
					>
						DISPONIBLE EN REMOTE
					</span>
				</div>

				{/* Name */}
				<div
					style={{
						fontSize: "72px",
						fontWeight: 900,
						textTransform: "uppercase",
						letterSpacing: "-0.02em",
						lineHeight: 1,
						marginBottom: "16px",
						display: "flex",
					}}
				>
					TITOSY MANANKASINA
				</div>

				{/* Job title */}
				<div
					style={{
						fontSize: "26px",
						fontWeight: 600,
						color: "#333",
						marginBottom: "40px",
						display: "flex",
					}}
				>
					Développeur Fullstack JavaScript & Flutter
				</div>

				{/* Skills row */}
				<div
					style={{
						display: "flex",
						gap: "12px",
						flexWrap: "wrap",
					}}
				>
					{[
						"React",
						"Next.js",
						"TypeScript",
						"Flutter",
						"Node.js",
						"Figma",
					].map((skill) => (
						<div
							key={skill}
							style={{
								border: "3px solid #000",
								padding: "8px 18px",
								fontSize: "18px",
								fontWeight: 700,
								background: "#B2BDA0",
								display: "flex",
							}}
						>
							{skill}
						</div>
					))}
				</div>

				{/* Bottom row */}
				<div
					style={{
						marginTop: "auto",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
					}}
				>
					<div
						style={{
							fontSize: "18px",
							color: "#555",
							display: "flex",
							gap: "6px",
							alignItems: "center",
						}}
					>
						Antananarivo, Madagascar
					</div>
					<div
						style={{
							fontSize: "22px",
							fontWeight: 800,
							textTransform: "uppercase",
							letterSpacing: "0.05em",
							display: "flex",
						}}
					>
						titosy.dev
					</div>
				</div>
			</div>
		</div>,
		{
			...size,
		},
	);
}
