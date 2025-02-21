import { HexColorInput, HexColorPicker } from 'react-colorful';

interface Props {
	value?: string;
	onPickerChange: (value: string) => void;
}
const ColorPick = ({ value, onPickerChange }: Props) => {
	return (
		<div className='relative'>
			<div className='flex flex-row items-center'>
				<p>{value && <span>#</span>}</p>
				<HexColorInput
					color={value}
					onChange={onPickerChange}
					className='hex-input'
				/>
			</div>
			<HexColorPicker color={value} onChange={onPickerChange} />
		</div>
	);
};

export default ColorPick;
