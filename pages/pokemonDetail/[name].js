import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../../components/header'
import client from '../../apollo-client'
import axios from 'axios'
import { Modal } from 'react-bootstrap';
import { css, cx } from '@emotion/css'

export async function getServerSideProps(ctx) {
	var name = ctx.params.name
	var query = `query pokemon($name: String!) {
			  	pokemon(name: $name) {
				    id
				    name
				    sprites {
				      	front_default
				    }
				    moves {
				      	move {
				        	name
				      	}
				    }
				    types {
				      	type {
				        	name
				      	}
				    }
				}
			}`;

	const detailData = await axios.post(`https://graphql-pokeapi.graphcdn.app`, {
		query,
	    variables: { name },
	})
	.then(data => data)

   
    return { 
        props: {
            detailData: detailData.data.data,
        },
    }
}

function PokemonDetail({ detailData }){
	const [showModal, setShowModal] = useState(false)
	const [showModal2, setShowModal2] = useState(false)
	const [nicknameState, setNickNameState] = useState('')
	const [successAdd, setSuccessAdd] = useState(false)
	const [loadingState, setLoadingState] = useState(false)

	const closeModal = () => {
		setShowModal(false)
	}

	const onShowModal2 = () => {
		setShowModal2(true)
	}	

	const closeModal2 = () => {
		setShowModal2(false)
	}	

	const addToMyPokemonList = (event, name, image) => {
		event.preventDefault();
		onShowModal2();
		setLoadingState(true)

		let nickname = document.getElementById('nickname').value;
		setNickNameState(nickname)

		var name = name
		var image = `"${image}"`

		var query = `mutation insert_MyPokemonList_one {
					  insert_MyPokemonList_one(
					  object: {
					    name: ${name},
					    image: ${image},
					    nickname: ${nickname}
					  }
					) {
						  name
						  image
						  nickname
					  }
					}`;

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
		  .then(data => {
		  	if(data.errors) setSuccessAdd(false); else setSuccessAdd(true);
		  })
		  .then(() => setLoadingState(false));
	}

  	return (
  		<>
	  		<Header showArrow={true}/>
	  		<div className="section pokemonDetail">
		  		<div className="container">
		  			<div>
					    <div className="row">
					    	<div className="col-md-4">
								<div className='text-center'><Image className="card-img-top" src={detailData.pokemon.sprites.front_default} width={1000} height={1000} alt="Card image cap"/></div>
						 	</div>
						 	<div className="col-md-5">
							 	<h1>{detailData.pokemon.name}</h1>
							 	<div className={css`
							 			overflow: auto;
							 		`}>
									<div className={css`
											float: left;
											margin-top: 30px;
										`}>
										<h5>Moves</h5>
										<ul>
											{
												detailData.pokemon.moves.map((obj, idx) => (
													<li key={idx} className={css`
															display: inline-block;
															float: left;
															width: 50%;
														`}>
														{
															obj.move.name
														}
													</li>
												))
											}
										</ul>
									</div>
									<div  className={css`
											float: left;
											margin-top: 30px;
											${`@media (max-width: 479px)`}{
												margin-bottom: 40px;
												width: 100%;
											}
										`}>
										<h5>Types</h5>
										<ul>
											{
												detailData.pokemon.types.map((obj, idx) => (
													<li key={idx} className={css`
															display: inline-block;
															float: left;
															width: 50%;
														`}>
														{
															obj.type.name
														}
													</li>
												))
											}
										</ul>
									</div>
							  	</div>
							</div>
							<div className="col-md-3">
								<button type="button" className={css`
									${`@media (max-width: 479px)`}{
										display: none;
									}
								`+' btn green-btn w-100 mt-5'} onClick={() => setShowModal(true)}>Catch</button>
						 	</div>
						</div>
					</div>
		  		</div>
	  		</div>
	  		<div className={css`
	  				height: 60px;
					width: 100%;
					background-color: #FFFFFF;
					box-shadow: rgb(49 53 59 / 12%) 0px -1px 6px;
					padding-top: 7px;
					padding-bottom: 7px;
					${`@media (min-width: 480px)`}{
						display: none;
					}
	  			`+ ' fixed-bottom'}>
	  			<div className="container">
	  				<button type="button" className="btn green-btn w-100" onClick={() => setShowModal(true)}>Catch</button>
	  			</div>
	  		</div>
	  		<Modal show={showModal} onHide={closeModal} centered>
                <div className="card-wrapper modal1">
					<div className="card pt-3">
						<div>
							<button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
					         	<span aria-hidden="true">&times;</span>
					        </button>
				        </div>
					    <div className={css`
					    		margin-top: -20px;
					    	`+' card-body'}>
					    	<div  className={css`
					    			width: 50%;
									margin-left: auto;
									margin-right: auto;
									text-align: center;
					    		`+' card-img-top'}><Image src={detailData.pokemon.sprites.front_default} width={1000} height={1000} alt="Card image cap"/></div>
					        <h3 className="mb-4">{detailData.pokemon.name}</h3>
					        <form className="form-group text-center" onSubmit={(event) => {addToMyPokemonList(event, detailData.pokemon.name, detailData.pokemon.sprites.front_default); setShowModal(false)}}>
						 		<input className="form-control w-100" type="text" placeholder="Nickname" id="nickname" required/>
						 		<input type="submit" className="btn green-btn mt-4" value="Add to my list"/>
						 	</form>   
					    </div>
					</div>
				</div>
            </Modal>
            <Modal show={showModal2} onHide={closeModal2} centered>
                <div className="card-wrapper modal2">
                	<div className={css`
                			height: 296px
                		`+' card pt-3'}>
						<div>
							<button type="button" className="close" onClick={() => setShowModal2(false)} aria-label="Close">
					         	<span aria-hidden="true">&times;</span>
					        </button>
				        </div>
					    <div className="card-body">
					    	{
					    		loadingState ? (
					    			<div className={css`
					    					text-align: center;
					    					margin-top: 30px;
					    				`}>
					    				<div className="lds-ellipsis mx-auto"><div></div><div></div><div></div><div></div></div>
					    			</div>
					    		) :
					    		successAdd ? (
					    			<div className="row">
										<div className="col-4">
											<div className="image-wrapper">
												<div className="text-center"><Image className="card-img-top" src={detailData.pokemon.sprites.front_default} width={1000} height={1000} alt="Card image cap"/></div>
									 		</div>
									 	</div>
									 	<div className="col-8 pl-0">
										 	<div className="card-body">
												<h5 className="card-title mb-4">{`${nicknameState} added successfully`}</h5>
											    <Link href="/myPokemonList"><a className="btn white-btn w-100 mt-3">My pokemon list</a></Link>

										  	</div>
									  	</div>
								  	</div>
					    		) : (
					    			<div className="row">
										<div className="col-4">
											<div className="image-wrapper">
												<div className="text-center"><Image className="card-img-top" src={'/assets/imgs/sad-emotion.jpg'} width={728} height={636} alt="Card image cap"/></div>
									 		</div>
									 	</div>
									 	<div className="col-8 pl-0">
										 	<div className="card-body">
												<h5 className="card-title mb-4">{`Nickname ${nicknameState} already used, use another nickname!`}</h5>
											    <button type="button" className="btn white-btn w-100 mt-3" onClick={() => {setShowModal2(false); setShowModal(true)}}>Try again</button>
										  	</div>
									  	</div>
								  	</div>
					    		)
					    	}
					        
					    </div>
					</div>
				</div>
            </Modal>
  		</>
  	);
}

export default PokemonDetail;