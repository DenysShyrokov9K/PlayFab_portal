import './Main.css'

const Header = (props) => {

    return (
        <nav>
            <h1 className="display-1 text-white ml-20"><strong>8 BALL</strong></h1>
            <div className='position-absolute top-0 right-5'>
                <h2 className="display-5 text-white ml-20 "><strong>Arcadian Portal</strong></h2>
                <h5 className='float-right text-white'>{props.check}</h5>
            </div>
        </nav>
    )
}

export default Header;