import Head from 'next/head'
import { useState } from 'react'
import Image from 'next/image'
import HomeCss from '../styles/Home.module.css'
import Link from 'next/link'
import { motion } from 'framer-motion'


export default function Home({arrayPokemonClean, typesList}) {

    const container = {
        hidden: { opacity: 0 },
        show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.07
        }
        }
    }
    
    const itemAnimated = {
        hidden: { opacity: 0, scale: 0 },
        show: { opacity: 1, scale: 1}
    }

    const [pokemon, setPokemon] = useState(arrayPokemonClean)

    const filter = (theType) => {
        //console.log(theType)
        setPokemon(arrayPokemonClean)

        if (theType == 'borrar') {
        setPokemon(arrayPokemonClean)
        }else{
        let newPokemon = arrayPokemonClean.filter(pokemon => pokemon.types.some(type => type.type.name == theType))
        .map(pokemons => {
            //console.log(pokemons)
            let newPokemons = {...pokemons}
            return newPokemons
        })
        setPokemon(newPokemon)
        //console.log(newPokemon)
        }

    }

    //console.log(typesList)
    return (
        <>
        <div className={HomeCss.buttonsType} >
        <button onClick={() => filter("borrar") } className={HomeCss.showAll} >
            Mostrar Todos
        </button>
        <div className={HomeCss.listTypes}>
        {typesList.map((type, index) => {
            return (
            <button key={type.name} className={`${type.name} ${HomeCss.listButtons}` } onClick={() => filter(type.name) }>
                {type.name}
            </button>
            )
        })}
        </div>
        </div>

        <h1>Pokemon App </h1>
        <motion.ul 
        variants={container}
        initial="hidden"
        animate="show"
        className={HomeCss.columns}  
        >
        {pokemon.map((pokemon, index) => {
            return(
            <motion.li
                key={pokemon.id}
                variants={itemAnimated}
            >
                <Link href={{
                pathname: '/pokemon/[name]',
                query: { name: pokemon.name}
                }}>
                <a>
                    <div className={`${HomeCss.card} ${pokemon.types[0].type.name}`}>
                    <div className={HomeCss.nameType}>
                        <h3> {pokemon.name} </h3>
                        <div className={HomeCss.types}>
                        {pokemon.types.map((type, index) => {
                            return(
                            <p key={index} className={HomeCss.type} > <span> {type.type.name} </span> </p>
                            )
                        })}
                        </div>
                        <motion.img 
                        src={pokemon.image} 
                        height="100" 
                        width="100" 
                        className={HomeCss.image} 
                        layoutId={pokemon.image}
                        />
                    </div>
                    </div>
                </a>
                </Link>
            </motion.li>
            )
        })}
        </motion.ul>

        </>
    )
}

export async function getServerSideProps() {

    const getTypes = await fetch('https://pokeapi.co/api/v2/type')
    const typesList = await getTypes.json()

    const traerPokemon = (numero) => {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${numero}`)
        .then(response => response.json())
        .then(data => data)
    }

    let arrayPokemon = []
    for (let i = 1; i <= 30; i++) {
        let pokemon = await traerPokemon(i)
        //console.log(pokemon)
        arrayPokemon.push(pokemon)
    }

    let arrayPokemonClean = arrayPokemon.map(pokemon => {
        return ({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites.other.dream_world.front_default,
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types,
        abilities: pokemon.abilities
    })

    })

    return {
    props: {
        arrayPokemonClean, typesList: typesList.results
    },
    }
}
