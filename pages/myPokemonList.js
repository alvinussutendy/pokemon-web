import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { css, cx } from '@emotion/css'

const trash  = <FontAwesomeIcon icon={faTrash}/>

const List = ({ pokeData, deleteData }) => (
	<div className={css`
			padding-top: 40px;
		`+' section pokeData'}>
		<div className="container">
			<h3>My Pokemon List</h3>
			<div className="row">
				{
					pokeData && pokeData.map((obj, idx) => {
						return(
							<div className="col-12" key={idx}>
								<div className="card w-100">
									<div className="row">
										<div className="col-5 col-md-6">
											<div className={css`
													position: relative;
													width: 100%;
													height: 100%;
												`}>
												<Link href={{
									              pathname: '/pokemonDetail/[name]',
									              query: { name: obj.name }
									            }}><a><div className={css`
									            			position: absolute;
															top: 50%;
															width: 100%;
															left: 0;
														  	-ms-transform: translateY(-50%);
														  	transform: translateY(-50%);
														  	${'@media (min-width: 480px)'}{
														  		width: 42%;
																left: 27%;
														  	}
									            	`}><Image className={css`
									            					width: 42%;
																	left: 25%;
									            		`+' card-img-top'} src={obj.image} width={1000} height={1000} alt="Card image cap"/></div></a>
									            </Link>
									 		</div>
									 	</div>
									 	<div className="col-7 col-md-6 pl-0">
										 	<div className="card-body">
										 		<span>Name</span><br/>
												<h5 className="card-title mb-4">{obj.name}</h5>
												<span>Nickname</span><br/>
												<h5 className="card-title">{obj.nickname}</h5>
											    <button className={css`
											    	width: 45%;
											    	${`@media (max-width: 479px)`}{
											    		width: 100%;
											    	}
											    `+' btn white-btn mt-3'} onClick={() => deleteData(obj.nickname)}>{trash} Delete</button>
										  	</div>
									  	</div>
								  	</div>
								</div>
							</div>
						)
					})
				}
			</div>
		</div>
	</div>
)

export async function getServerSideProps(ctx) {
	var query = `query MyQuery {
		  MyPokemonList{
		    name
		    image
		    nickname
		  }
		}
	`;

	const pokeData = await fetch('https://valid-hookworm-80.hasura.app/v1/graphql', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Accept': 'application/json',
	    'x-hasura-admin-secret': '7FBVXLSS6VA5oDtk1D4gZbLKaxcom4B7Kx4Q2B1vvN82gMhkkc1M4EayjpXOXGxR'
	  },
	  body: JSON.stringify({query: query})
	})
	  .then(r => r.json())
	  .then(data => data);

   
    return { 
        props: {
            pokeData: pokeData.data.MyPokemonList,
        },
    }
}

const deleteFromMyPokemonList = (nickname) => {
	var nickname = nickname

	var query = `mutation delete_MyPokemonList_by_pk {
		  delete_MyPokemonList_by_pk(nickname: ${nickname}){
		    name
		    image
		    nickname
		  }
		}
	`;

	fetch('https://valid-hookworm-80.hasura.app/v1/graphql', {
	  method: 'POST',
	  headers: {
	    'Content-Type': 'application/json',
	    'Accept': 'application/json',
	    'x-hasura-admin-secret': '7FBVXLSS6VA5oDtk1D4gZbLKaxcom4B7Kx4Q2B1vvN82gMhkkc1M4EayjpXOXGxR'
	  },
	  body: JSON.stringify({query: query})
	})
	  .then(r => r.json())
}

function PokemonList({ pokeData }){
	const [ pokeDataState, setPokeDataState ] = useState(pokeData)

	const deleteData = (nickname) => {
		deleteFromMyPokemonList(nickname);
		let filtered = pokeDataState.filter((obj) => obj.nickname != nickname)
		setPokeDataState(filtered)
	}

	return(
		<div className="myPokemonList">
			<Header showArrow={true}/>
			<List pokeData={pokeDataState} deleteData={(nickname) => deleteData(nickname)}/>
		</div>
	)
	
}

export default PokemonList;