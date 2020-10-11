const fs = require('fs')
const emoji = require('node-emoji')
const path = require('path')

const getAnimalsData = () => {
  let data = [
    {
      names: {
        single: 'Rind',
        plural: 'Rinder',
        emoji: emoji.get('cow')
      },
      deaths: {
        year: 1649.5 * 1000 * 2
      },
      children: [
        {
          name: 'Kälber',
          deaths: {
            year: 156.9 * 1000 * 2
          }
        },
        {
          name: 'Jungrinder',
          deaths: {
            year: 8.7 * 1000 * 2
          }
        },
        {
          name: 'Färsen',
          deaths: {
            year: 283.1 * 1000 * 2
          }
        },
        {
          name: 'Kühe',
          deaths: {
            year: 578 * 1000 * 2
          }
        },
        {
          name: 'Ochsen',
          deaths: {
            year: 9.8 * 1000 * 2
          }
        },
        {
          name: 'Bullen',
          deaths: {
            year: 613.1 * 1000 * 2
          }
        }
      ]
    },
    {
      names: {
        single: 'Schwein',
        plural: 'Schweine',
        emoji: emoji.get('pig')
      },
      deaths: {
        year: 27217.5 * 1000 * 2
      }
    },
    {
      names: {
        single: 'Huhn',
        plural: 'Hühner',
        emoji: emoji.get('chicken')
      },
      deaths: {
        year: 786.8 * 1000 * 2
      },
      children: [
        {
          name: 'Jungmasthühner ',
          deaths: {
            year: 512.5 * 1000 * 2
          }
        },
        {
          name: 'Truthühner',
          deaths: {
            year: 237.4 * 1000 * 2
          }
        }
      ]
    },
    {
      names: {
        single: 'Schaf',
        plural: 'Schafe',
        emoji: emoji.get('sheep')
      },
      deaths: {
        year: 553.6 * 1000 * 2
      },
      children: [
        {
          name: 'Lämmer',
          deaths: {
            year: 497.1 * 1000 * 2
          }
        }
      ]
    },
    {
      names: {
        single: 'Ziege',
        plural: 'Ziegen',
        emoji: emoji.get('goat')
      },
      deaths: {
        year: 9.8 * 1000 * 2
      }
    },
    {
      names: {
        single: 'Pferd',
        plural: 'Pferde',
        emoji: emoji.get('horse')
      },
      deaths: {
        year: 2.4 * 1000 * 2
      }
    }
  ]

  // data = data.map(Animal => {

  // })

  data = data.sort((a, b) => {
    return b.deaths.year - a.deaths.year
  })

  data = data.map(Animal => {
    Animal.deaths.perDay = parseFloat(Animal.deaths.year / 365)
    Animal.deaths.perHour = parseFloat(Animal.deaths.perDay / 24)
    Animal.deaths.perMin = parseFloat(Animal.deaths.perDay / 1440)
    Animal.deaths.perSec = parseFloat(Animal.deaths.perDay / 86400)

    if (typeof Animal.children !== 'undefined') {
      Animal.children.map(Child => {
        Child.deaths.perDay = parseFloat(Child.deaths.year / 365)
        Child.deaths.perHour = parseFloat(Child.deaths.perDay / 24)
        Child.deaths.perMin = parseFloat(Child.deaths.perDay / 1440)
        Child.deaths.perSec = parseFloat(Child.deaths.perDay / 86400)
      })

      Animal.children = Animal.children.sort((a, b) => {
        return b.deaths.year - a.deaths.year
      })
    }

    return Animal
  })

  console.log(data)
  return data
}

fs.writeFile(path.resolve(__dirname, 'animals.json'), JSON.stringify(getAnimalsData()), () => {
  console.log('Written Animals config to animals.json', new Date())
})
