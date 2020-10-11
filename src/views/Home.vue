<template>
  <div class="container">
    <h1 class="display-1 text-center mt-5 mb-5">Tiermorde in Deutschland</h1>
    <p>
      Jeden Tag werden in Deutschland Tiere ermordet um dann bei Menschen auf
      dem Teller zu landen. Doch Tiere werden noch zu viel mehr Zwecken
      ausgenutzt und missbraucht. Hier findest du eine Übersicht, wie viele
      Tiere so für Menschen sterben müssen ohne eine Wahl zu haben.
    </p>

    <ul v-if="ready" class="list-group pb-5 pt-3">
      <li class="list-group-item font-weight-bold">
        <div class="row">
          <div class="col-md-5">
            <span class="d-none d-md-block">Tier</span>
            <span class="d-block d-md-none">Tiere</span>
          </div>
          <div class="col-md-2 d-flex align-items-center justify-content-end">
            <span class="d-none d-md-block">heute</span>
          </div>
          <div class="col-md-2 d-flex align-items-center justify-content-end">
            <span class="d-none d-md-block">pro Tag</span>
          </div>
          <div
            class="col-md-3 d-flex align-items-center justify-content-end text-right"
          >
            <span class="d-none d-md-block">dieses Jahr</span>
          </div>
        </div>
      </li>
      <div v-for="(animal, index) in animalData" :key="index">
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-5">
              <h3>{{ animal.names.emoji }} {{ animal.names.plural }}</h3>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-between justify-content-md-end">
                <span class="d-block d-md-none">heute</span>
                <span class="font-weight-bold text-danger">{{ animal.deaths.currentDay }}</span>
            </div>
            <div class="col-md-2 d-flex align-items-center justify-content-between justify-content-md-end">
                <span class="d-block d-md-none">pro Tag</span>
                <span class="font-weight-bold">{{ animal.deaths.perDayView }}</span>
            </div>
            <div class="col-md-3 d-flex align-items-center justify-content-between justify-content-md-end">
                <span class="d-block d-md-none">dieses Jahr</span>
                <span class="font-weight-bold">{{ animal.deaths.currentYear }}</span>
            </div>
          </div>
          <div v-if="animal.deaths.list.length" class="row">
            <div class="col-12">
              <small
                >Seit du da bist wurden schon
                <span class="text-danger font-weight-bold"
                  >{{ animal.deaths.list.length }}
                  {{ animal.names.plural }}</span
                >
                getötet...</small
              >
            </div>
            <div class="col-12">
              {{ animal.deaths.list }}
            </div>
          </div>
        </li>
        <div>
          <li
            v-for="(child, index) in animal.children"
            :key="index"
            class="list-group-item children"
          >
            <div class="row">
              <div class="col-md-5 pl-5">davon {{ child.name }}</div>
              <div
                class="col-md-2 d-flex align-items-center justify-content-end"
              >
                {{ child.deaths.currentDay }}
              </div>
              <div
                class="col-md-2 d-flex align-items-center justify-content-end"
              >
                {{ child.deaths.perDayView }}
              </div>
              <div
                class="col-md-3 d-flex align-items-center justify-content-end"
              >
                {{ child.deaths.currentYear }}
              </div>
            </div>
          </li>
        </div>
      </div>
    </ul>

    <p>Die Zahlen sind eine Berechnung an Hand der Zahlen vom Jahr 2019.</p>
    <p>Quellen:</p>
    <ul>
      <li>
        <a
          href="https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Landwirtschaft-Forstwirtschaft-Fischerei/Tiere-Tierische-Erzeugung/Tabellen/gewerbliche-schlachtung-jahr-halbjahr.html"
          target="_blank"
          rel="noopener"
        >
          Gewerbliche Schlachtungen im 1. Halbjahr 2019
        </a>
        vom Statistischen Bundesamt (Stand: 7. August 2019)
      </li>
    </ul>

    <h5 class="display-5 text-center mt-5 mb-3">Morde seit du da bist</h5>
    <p class="text-center">{{totalDeaths.join('')}}</p>

    <h5 class="display-5 text-center mt-5 mb-3">Was kann ich tun?</h5>
    <a href="https://veganstart.de/" class="btn btn-block cta mb-5" target="_blank" rel="noopener">
      #GoVegan
    </a>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import AnimalData from '@/data/animals.json'
import humanize from 'humanize'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'Home',
  components: {},
  data: function () {
    return {
      started: moment(),
      now: moment(),
      animalData: AnimalData,
      totalDeaths: [],
      ready: false
    }
  },
  computed: {
    totalValues: function () {
      const totals = {
        currentYear: 0
      }
      this.animalData.map((Animal) => {
        totals.currentYear += Animal.deaths.currentYearRaw
        totals.currentDay += Animal.deaths.currentDayRaw
      })

      totals.currentYear = humanize.numberFormat(totals.currentYear, 0, '.', '.')
      totals.currentDay = humanize.numberFormat(totals.currentDay, 0, '.', '.')

      return totals
    }
  },
  methods: {
    loadData () {
      const secondsSinceYearStart = Math.abs(
        moment().startOf('year').diff(this.now) / 1000
      )
      const secondsSinceDayStart = Math.abs(
        moment().startOf('day').diff(this.now) / 1000
      )
      this.animalData = this.animalData.map((Animal) => {
        Animal.deaths.currentYearRaw =
          Animal.deaths.perSec * secondsSinceYearStart
        Animal.deaths.currentYear = humanize.numberFormat(
          Math.round(Animal.deaths.currentYearRaw),
          0,
          '.',
          '.'
        )

        Animal.deaths.currentDayRaw =
          Animal.deaths.perSec * secondsSinceDayStart
        Animal.deaths.currentDay = humanize.numberFormat(
          Math.round(Animal.deaths.currentDayRaw),
          0,
          '.',
          '.'
        )

        Animal.deaths.perDayView = humanize.numberFormat(
          Animal.deaths.perDay,
          0,
          '.',
          '.'
        )

        Animal.deaths.list = []

        if (typeof Animal.children !== 'undefined') {
          Animal.children.map((Child) => {
            Child.deaths.currentYearRaw =
              Child.deaths.perSec * secondsSinceYearStart
            Child.deaths.currentYear = humanize.numberFormat(
              Math.round(Child.deaths.currentYearRaw),
              0,
              '.',
              '.'
            )

            Child.deaths.currentDayRaw =
              Child.deaths.perSec * secondsSinceDayStart
            Child.deaths.currentDay = humanize.numberFormat(
              Math.round(Child.deaths.currentDayRaw),
              0,
              '.',
              '.'
            )

            Child.deaths.perDayView = humanize.numberFormat(
              Child.deaths.perDay,
              0,
              '.',
              '.'
            )
          })

          Animal.children = Animal.children.sort((a, b) => {
            return b.deaths.year - a.deaths.year
          })
        }

        return Animal
      })
    },
    updateData () {
      this.now = moment()
      this.totalDeaths = []
      const secondsSinceStart = this.now.diff(this.started) / 1000
      this.animalData = this.animalData.map((Animal) => {
        const freshKilled = Animal.deaths.perSec * secondsSinceStart
        console.log(Animal, `+${freshKilled}`)
        Animal.deaths.currentYear = humanize.numberFormat(
          Math.round(Animal.deaths.currentYearRaw + freshKilled),
          0,
          '.',
          '.'
        )
        Animal.deaths.currentDay = humanize.numberFormat(
          Math.round(Animal.deaths.currentDayRaw + freshKilled),
          0,
          '.',
          '.'
        )

        const freshKilledRounded = Math.round(freshKilled)
        if (freshKilledRounded > 0) {
          this.totalDeaths.push(...Array(freshKilledRounded)
            .fill(Animal.names.emoji))
          Animal.deaths.list = Array(freshKilledRounded)
            .fill(Animal.names.emoji)
            .join('')
        }

        if (typeof Animal.children !== 'undefined') {
          Animal.children.map((Child) => {
            Child.deaths.currentYear = humanize.numberFormat(
              Math.round(Child.deaths.currentYearRaw + freshKilled),
              0,
              '.',
              '.'
            )
            Child.deaths.today = humanize.numberFormat(
              Math.round(Child.deaths.currentDayRaw + freshKilled),
              0,
              '.',
              '.'
            )
          })

          Animal.children = Animal.children.sort((a, b) => {
            return b.deaths.year - a.deaths.year
          })
        }

        return Animal
      })

      this.totalDeaths = _.shuffle(this.totalDeaths)
    }
  },
  mounted: function () {
    this.loadData()
    this.ready = true
    setInterval(this.updateData, 1000)
  }
}
</script>

<style scoped>
a.cta {
  background-color: lightgreen;
  border: 3px solid transparent;
  color: white;
  font-size: 32px;
  line-height: 72px;
  border-radius: 10px;
}
a.cta:hover {
  background-color: white;
  color: #333;
  border: 3px solid green;
}
</style>
