import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/header'
import client from '../apollo-client'
import { gql } from "@apollo/client"

const List = ({ pokeData, ownedTotal }) => (
	<div className="section pokeData">
		<div className="container">
			<h4>Owned Total of Pokemon: {ownedTotal}</h4><br/>
			<h2>Pokemon List</h2>
			<div className="row">
				{
					pokeData.map((obj, idx) => {
						return(
							<div className="col-6 col-md-2 custom-padding" key={idx}>
								<Link href={{
					              pathname: '/pokemon_detail/[name]',
					              query: { name: obj.name }
					            }}
					             ><a>
					             	<div className="card w-100">
										<div className="image"><Image className="card-img-top" src={obj.image} width={250} height={250} alt="Card image cap"/></div>
									 	<div className="card-body pt-0">
									 		<h5 className="card-title">{obj.name}</h5>
									 	</div>
									</div>
					             </a></Link>
							</div>
						)
					})
				}
			</div>
		</div>
	</div>
)

export async function getServerSideProps(ctx) {
    const { data } = await client.query({
		query: gql`
			query Pokemons($limit: Int, $offset: Int) {
			    pokemons(limit: $limit, offset: $offset) {
			      count
			      results {
			        url
			        name
			        image
			      }
			    }
			  }
		`,
	})

    return { 
        props: {
        	ownedTotal: data.pokemons.count,
            pokeData: data.pokemons.results,
        },
    }


}

class PokemonList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
		}
	}

	render(){
		return(
			<>
				<Header/>
				<List pokeData={this.props.pokeData} ownedTotal={this.props.ownedTotal}/>
			</>
		)
	}
	
}

export default PokemonList;