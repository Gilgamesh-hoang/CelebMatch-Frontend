interface Props {
    label: string
}

const Nav = ({label}: Props) => {
    return (
        <div>
            <p>{label}</p>
            {
                Array.from({ length: 100 }, (_, index) => (
                    <div key={index}>
                        {index % 20 === 0 && index ? 'more' : '...'}
                        <br />
                    </div>
                ))
            }
        </div>
    )
}
export default Nav
