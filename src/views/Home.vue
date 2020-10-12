<template>
  <div class="container-fluid">

    <div class="container">

    <h1 class="display-1 text-center mt-5 mb-5">Tiermorde in Deutschland</h1>
    <p>
      Jeden Tag werden in Deutschland Tiere ermordet um dann bei Menschen auf
      dem Teller zu landen. Doch Tiere werden noch zu viel mehr Zwecken
      ausgenutzt und missbraucht. Hier findest du eine Übersicht, wie viele
      Tiere so für Menschen sterben müssen ohne eine Wahl zu haben.
    </p>

    <div v-if="totalDeaths.length" class="alert alert-danger" role="alert">
      Du bist seit <strong>{{ computedTimeSinceStart }}</strong> hier und seit
      deiner lebendigen Ankunft hier mussten schon
      <strong>{{ totalDeaths.length }} Tiere</strong> ihr Leben für die
      Menschheit opfern. 😢
    </div>

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
      <div
        v-for="(animal, index) in animalData"
        :key="index"
        class="animalContainer"
      >
        <li class="list-group-item">
          <div class="row">
            <div class="col-md-5">
              <h3>{{ animal.names.emoji }} {{ animal.names.plural }}</h3>
            </div>
            <div
              class="col-md-2 d-flex align-items-center justify-content-between justify-content-md-end"
            >
              <span class="d-block d-md-none">heute</span>
              <span class="font-weight-bold text-danger"
                ><v-number
                  v-model="animal.deaths.currentDayRounded"
                  :speed="369"
                ></v-number
              ></span>
            </div>
            <div
              class="col-md-2 d-flex align-items-center justify-content-between justify-content-md-end"
            >
              <span class="d-block d-md-none">pro Tag</span>
              <span class="font-weight-bold">{{
                animal.deaths.perDayView
              }}</span>
            </div>
            <div
              class="col-md-3 d-flex align-items-center justify-content-between justify-content-md-end"
            >
              <span class="d-block d-md-none">dieses Jahr</span>
              <span class="font-weight-bold text-danger"
                ><v-number
                  v-model="animal.deaths.currentYearRounded"
                  :speed="369"
                ></v-number
              ></span>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-8">
              <small v-if="animal.deaths.list.length"
                >Seit du da bist
                {{ animal.deaths.list.length > 1 ? "wurden" : "wurde" }} schon
                <span class="text-danger font-weight-bold"
                  >{{ animal.deaths.list.length }}
                  {{ animal.names.getNameByDeaths() }}</span
                >
                getötet...</small
              >
            </div>
            <div
              v-if="animal.children.length"
              class="col-md-4 text-right order-2 order-md-1"
            >
              <a
                v-if="animal.childView === false"
                href="javascript:"
                class="btn btn-sm btn-light"
                @click.prevent="togglechildView(animal)"
                >weitere Untergruppen</a
              >
              <a
                v-else
                href="javascript:"
                class="btn btn-sm btn-light"
                @click.prevent="togglechildView(animal)"
                >Untergruppen ausblenden</a
              >
            </div>
            <div
              class="col-12 order-1 order-md-2"
              v-if="animal.deaths.list.length"
            >
              {{ animal.deaths.listView }}
            </div>
          </div>
        </li>
        <div v-if="animal.childView">
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

    <div v-if="totalDeaths.length">
      <h4 class="display-4 text-center mt-3 mb-3">
        Tiermorde in Deutschland seit du da bist
      </h4>
      <div class="text-center mb-3">
        <span class="badge bg-light text-dark"
          >🕰 Du bist seit {{ computedTimeSinceStart }} hier.</span
        >
      </div>
      <p class="text-center">{{ totalDeaths.join("") }}</p>
      <div class="text-center">
        <div
          v-for="(animal, index) in animalData"
          :key="index"
          class="d-inline"
        >
          <span
            v-if="animal.deaths.list.length"
            class="badge rounded-pill bg-dark m-1"
            >{{ animal.deaths.list.length }} {{ animal.names.emoji }}
            {{ animal.names.getNameByDeaths() }}</span
          >
        </div>
      </div>
    </div>

    <h4 class="display-4 text-center mt-5 mb-3">Was kann ich tun?</h4>
    <a
      href="https://veganstart.de/"
      class="btn btn-block cta"
      target="_blank"
      rel="noopener"
    >
      <span class="d-none d-md-inline">🐷🐮🐔</span> #GoVegan <span class="d-none d-md-inline">🐔🐮🐷</span>
    </a>

    <h5 class="display-5 text-center mt-5 mb-3">Teile diese Seite</h5>
    <div class="text-center shareLinks mt-3 mb-5">

      <!-- Sharingbutton Facebook -->
      <a class="resp-sharing-button__link" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="">
        <div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
          </div>
        </div>
      </a>

      <!-- Sharingbutton Twitter -->
      <a class="resp-sharing-button__link" :href="computedShares.twitter.url" target="_blank" rel="noopener" aria-label="">
        <div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
          </div>
        </div>
      </a>

      <!-- Sharingbutton E-Mail -->
      <a class="resp-sharing-button__link" :href="`mailto:?subject=#GoVegan&amp;body=${computedShares.text}`" target="_self" rel="noopener" aria-label="">
        <div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z"/></svg>
          </div>
        </div>
      </a>

      <!-- Sharingbutton LinkedIn -->
      <a class="resp-sharing-button__link" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="">
        <div class="resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z"/></svg>
          </div>
        </div>
      </a>

      <!-- Sharingbutton WhatsApp -->
      <a class="resp-sharing-button__link" :href="`whatsapp://send?text=${computedShares.text}`" target="_blank" rel="noopener" aria-label="">
        <div class="resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z"/></svg>
          </div>
        </div>
      </a>

      <!-- Sharingbutton Telegram -->
      <a class="resp-sharing-button__link" :href="`https://t.me/share/url?url=https%3A%2F%2Fvegan.to&text=${computedShares.text}`" target="_blank" rel="noopener" aria-label="">
        <div class="resp-sharing-button resp-sharing-button--telegram resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z"/></svg>
          </div>
        </div>
      </a>

    </div>

    <h6 class="display-6 text-center mt-5 mb-3">Anmerkungen</h6>
    <p>
      Die Zahlen sind eine Hochrechnung basierend auf Statistiken.
    </p>
    <p>
      Quellen:
    </p>
    <ul>
      <li><a
        href="https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Landwirtschaft-Forstwirtschaft-Fischerei/Tiere-Tierische-Erzeugung/Tabellen/gewerbliche-schlachtung-jahr-halbjahr.html"
        target="_blank"
        rel="noopener"
      >
        Gewerbliche Schlachtungen im 1. Halbjahr 2019
      </a>
      vom Statistischen Bundesamt (Stand: 7. August 2019)</li>
      <li><a
        href="https://de.statista.com/statistik/daten/studie/494476/umfrage/schlachtungen-von-huehnern-in-der-eu-nach-laendern/"
        target="_blank"
        rel="noopener"
      >
        Anzahl der Schlachtungen von Hühnern in der Europäischen Union nach Ländern
      </a> von der Statista GmbH (Stand: Jahr 2019)</li>
    </ul>
    <p>
      Aktuelles Logo von
      <a href="https://freeicons.io/profile/722" target="_blank" rel="noopener"
        >Fasil @ www.freeicons.io</a
      >, Danke!
    </p>

    </div>

<div class="row">
  <footer class="footer bg-dark text-light mt-auto py-3">
    <div class="text-center">
      <span>&copy; 2020 &bull; vegan.to</span>
    </div>
    <div class="text-center">
      <a class="githubLink" href="https://github.com/shroomlife/vegan.to" target="_blank" rel="noopener">
        <img src="/img/GitHub-Mark-32px.png" width="32" height="32" alt="GitHub" />
      </a>
    </div>
    <div class="text-center versionTag">
      <p>v{{pkg.version}} </p>
    </div>
  </footer>
</div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import AnimalData from '@/data/animals'
import humanize from 'humanize'
import humanizeDuration from 'humanize-duration'
import moment from 'moment'
import { VNumber } from '@maxflex/v-number'
import _ from 'lodash'
import pkg from '../../package'

export default {
  name: 'Home',
  components: {
    VNumber
  },
  data: function () {
    return {
      started: moment(),
      now: moment(),
      animalData: AnimalData,
      totalDeaths: [],
      ready: false,
      pkg: pkg
    }
  },
  computed: {
    computedShares: function () {
      const desc = `In nur ${this.computedTimeSinceStart} in denen ich auf https://vegan.to war, sind in #Deutschland schon ${this.totalDeaths.length} Tiere ermordet worden...\n\n#GoVegan\n#StopEatingAnimals\n#PostmeatGeneration\n\n🐷🐮🐔`
      return {
        text: desc,
        twitter: {
          url: `https://twitter.com/intent/tweet/?text=${encodeURIComponent(desc)}&amp;url=${encodeURIComponent('https://vegan.to')}`
        }
      }
    },
    computedDeathsPerAnimal: function () {
      return this.animalData.map((Animal) => {
        return Animal
      })
    },
    computedTimeSinceStart: function () {
      const difference = this.now.diff(this.started)
      return humanizeDuration(difference, {
        language: 'de',
        fallbacks: ['en'],
        round: true
      })
    },
    totalValues: function () {
      const totals = {
        currentYear: 0
      }
      this.animalData.map((Animal) => {
        totals.currentYear += Animal.deaths.currentYearRaw
        totals.currentDay += Animal.deaths.currentDayRaw
      })

      totals.currentYear = humanize.numberFormat(
        totals.currentYear,
        0,
        '.',
        '.'
      )
      totals.currentDay = humanize.numberFormat(totals.currentDay, 0, '.', '.')

      return totals
    }
  },
  methods: {
    togglechildView (animal) {
      this.animalData = this.animalData.map((Animal) => {
        if (animal.names.single === Animal.names.single) {
          Animal.childView = !Animal.childView
        }
        return Animal
      })
    },
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
        Animal.deaths.currentYearRounded = Math.round(
          Animal.deaths.currentYearRaw
        )
        Animal.deaths.currentYear = humanize.numberFormat(
          Math.round(Animal.deaths.currentYearRaw),
          0,
          '.',
          '.'
        )

        Animal.deaths.currentDayRaw =
          Animal.deaths.perSec * secondsSinceDayStart
        Animal.deaths.currentDayRounded = Math.round(
          Animal.deaths.currentDayRaw
        )
        Animal.deaths.currentDay = humanize.numberFormat(
          Math.round(Animal.deaths.currentDayRaw),
          0,
          '.',
          '.'
        )

        Animal.deaths.perDayView = Math.round(Animal.deaths.perDay)

        Animal.deaths.list = []
        Animal.deaths.listView = ''

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
            Child.deaths.currentYearRounded = Math.round(
              Child.deaths.currentYearRaw
            )

            Child.deaths.currentDayRaw =
              Child.deaths.perSec * secondsSinceDayStart
            Child.deaths.currentDayRounded = Math.round(
              Child.deaths.currentDayRaw
            )
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
        } else {
          Animal.children = []
        }

        Animal.childView = false

        return Animal
      })
    },
    updateData () {
      this.now = moment()

      this.totalDeaths = []

      const secondsSinceStart = this.now.diff(this.started) / 1000
      this.animalData = this.animalData.map((Animal) => {
        const freshKilled = Animal.deaths.perSec * secondsSinceStart
        Animal.deaths.currentYear = humanize.numberFormat(
          Math.round(Animal.deaths.currentYearRaw + freshKilled),
          0,
          '.',
          '.'
        )
        Animal.deaths.currentYearRounded = Math.round(
          Animal.deaths.currentYearRaw + freshKilled
        )
        Animal.deaths.currentDay = humanize.numberFormat(
          Math.round(Animal.deaths.currentDayRaw + freshKilled),
          0,
          '.',
          '.'
        )
        Animal.deaths.currentDayRounded = Math.round(
          Animal.deaths.currentDayRaw + freshKilled
        )

        const freshKilledRounded = Math.round(freshKilled)
        // const deathsBefore = Animal.deaths.list.length

        if (freshKilledRounded > 0) {
          Animal.deaths.list = Array(freshKilledRounded).fill(
            Animal.names.emoji
          )
          this.totalDeaths.push(...Animal.deaths.list)
          Animal.deaths.listView = Animal.deaths.list.join('')
        }

        // const deathsAfter = Animal.deaths.list.length - deathsBefore

        if (typeof Animal.children !== 'undefined') {
          Animal.children.map((Child) => {
            Child.deaths.currentYear = humanize.numberFormat(
              Math.round(Child.deaths.currentYearRaw + freshKilled),
              0,
              '.',
              '.'
            )
            Child.deaths.currentYearRounded = Math.round(
              Child.deaths.currentYearRaw + freshKilled
            )
            Child.deaths.currentDay = humanize.numberFormat(
              Math.round(Child.deaths.currentDayRaw + freshKilled),
              0,
              '.',
              '.'
            )
            Child.deaths.currentDayRounded = Math.round(
              Child.deaths.currentDayRaw + freshKilled
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
    // setTimeout(this.updateData, 5000)
  }
}
</script>

<style scoped>
a.cta {
  background-color: lightgreen;
  border: 3px solid transparent;
  color: white;
  line-height: 172px;
  border-radius: 15px;
  font-weight: 700;
  font-size: 42px;
  box-shadow: 0 3px 10px green;
  transition: all 0.33s;
  display: flex;
  justify-content: space-around;
}
a.cta span {
  opacity: 0;
  transition: opacity 0.33s;
}
a.cta:hover {
  background-color: white;
  color: #333;
  border: 3px solid green;
}
a.cta:hover span {
  opacity: 1;
}
.animalContainer {
  transition: background-color 0.33s;
}
a.githubLink {
  display: inline-block;
  opacity: .33;
  margin-top: 1em;
  margin-bottom: 1em;
  transition: opacity 0.33s;
}
a.githubLink:hover {
  opacity: .66;
}
.versionTag {
  font-size: 75%;
}
</style>
