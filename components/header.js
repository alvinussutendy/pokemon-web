import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { css, cx } from '@emotion/css'

const arrowLeft  = <FontAwesomeIcon icon={faArrowLeft}/>

function Header({ showArrow, menu }){

	const router = useRouter()

	return(
		<div className="sticky-top">
            <nav className={css`
            			box-shadow: 0 4px 6px -1px rgb(0 0 0 / 7%);
						background-color: #FFFFFF;
            	`+' navbar navbar-expand-md'}>
            	<div className="container">
            		{showArrow && <button className={css`
            							font-size: 25px;
										color: #000000;
										width: 37.5px;
										display: inline-block;
										background-color: transparent;
										border: none;
										margin-right: 10px;
									${`@media (min-width: 480px)`}{
										display: none;
									}
								`} type="button" onClick={() => router.back()}>
				      {arrowLeft}
				    </button>}
                    <Link href="/"><a className="navbar-brand"><div className={css`
                    		width: 145px;
                    		${`@media (max-width: 479px)`}{
								width: 130px;
							}
                    	`}><Image src="/assets/imgs/pokemon-logo.png" width={640} height={236} alt="Logo Pokemon" /></div></a></Link>
                    
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link href="/myPokemonList"><a className={`nav-link text-dark ${menu=='myPokemonList' ? 'active' : ''}`}>My Pokemon List</a></Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
	)
}

export default Header