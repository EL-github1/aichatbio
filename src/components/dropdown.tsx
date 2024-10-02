import { h, JSX } from "preact"

function Dropdown(props: {
    value: string | number
    onChange: any
    options: Array<{ value: string | number; label: string }>
    onClick?: () => void
}): JSX.Element {

    return (
        <select className="cba-block cba-max-w-[9.5rem] cba-border-0 cba-p-2.5 cba-pr-2 cba-text-sm focus:cba-ring-0 dark:cba-bg-neutral "
            value={props.value}
            onChange={props.onChange}
            onClick={props.onClick}
        >
            {props.options.map(({ value, label }) => (
                <option className="cba-bg-[#343541] cba-text-white"
                 key={value} value={value}>{label}</option>
            ))}
        </select>
    )
}

export default Dropdown
