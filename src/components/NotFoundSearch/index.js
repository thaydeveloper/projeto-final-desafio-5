import './styles.css'
import notFoundSearchImage from '../../assets/icons/notFoundSearch.svg'

function NotFoundSearch() {
    return (
        <div className='notFoundContainer verticalAlign'>
            <img className='notFoundImage' src={notFoundSearchImage} alt='Not Found' />
            <h1 className='notFoundTitle weight600'>Nenhum resultado foi encontrado!</h1>
            <h1 className='notFoundSubTitle size24 weight600'>Verifique se escrita está correta</h1>
        </div>
    )
}

export default NotFoundSearch;