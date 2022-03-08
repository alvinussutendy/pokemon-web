import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/header'
import client from '../apollo-client'
import { gql } from "@apollo/client"
import InfiniteScroll from "react-infinite-scroll-component";

const List = ({ pokeData, ownedTotal, fetchMoreData, hasMore }) => (
	<div className="section pokeData">
		<div className="container">
			<h4>Owned Total of Pokemon: {ownedTotal}</h4><br/>
			<h2>Pokemon List</h2>
			<InfiniteScroll
				dataLength={pokeData.length}
				next={fetchMoreData}
				hasMore={hasMore}
				loader={<h4>Loading...</h4>}
	        >
			<div className="row">
					{
						pokeData.map((obj, idx) => {
							return(
						          	<div className="col-6 col-md-2 custom-padding" key={idx}>
										<Link href={{
							              pathname: '/pokemonDetail/[name]',
							              query: { name: obj.name }
							            }}
							             ><a>
							             	<div className="card w-100">
												<div className="image"><Image className="card-img-top" src={obj.image} width={250} height={250} alt="Card image cap"/></div>
											 	<div className="card-body pt-0">
											 		<h5 className="card-title text-center">{obj.name}</h5>
											 	</div>
											</div>
							             </a></Link>
									</div>
							)
						})
					}
			</div>
			</InfiniteScroll>
		</div>
	</div>
)

export async function getServerSideProps(ctx) {
    const { data } = await client.query({
		query: gql`
			query Pokemons($offset: Int) {
			    pokemons(limit: 200, offset: $offset) {
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

function PokemonList({ pokeData, ownedTotal }){

	const [pokeDataItem, setPokeDataItem] = useState(pokeData.slice(0, 20))
	const [hasMore, setHasMore] = useState(true)

	const fetchMoreData = () => {
		if(pokeData.length == pokeDataItem.length){
			setHasMore(false)
		}

	    // a fake async api call like which sends
	    // 20 more records in 1.5 secs
	    setTimeout(() => {
	      setPokeDataItem(pokeDataItem.concat(pokeData.slice(pokeDataItem.length, pokeDataItem.length+20)))
	    }, 1500);
	  };

	return(
		<div className="pokemonList">
			<Header/>
			<List pokeData={pokeDataItem} ownedTotal={ownedTotal} fetchMoreData={() => fetchMoreData()} hasMore={hasMore}/>
		</div>
	)
	
}

export default PokemonList;