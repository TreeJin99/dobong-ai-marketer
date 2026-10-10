// 서비스 화면 (손님이 들어오자마자 바로 쓰는 장).
// 어떤 화면이 나올지는 data/site.js 의 type 이 정합니다.
import MapApp from "@/components/MapApp";
import ListApp from "@/components/ListApp";
import CalcApp from "@/components/CalcApp";
import QuizApp from "@/components/QuizApp";
import LogApp from "@/components/LogApp";
import { site } from "@/data/site";

const APPS = { map: MapApp, list: ListApp, calc: CalcApp, quiz: QuizApp, log: LogApp };

export default function Home() {
  const App = APPS[site.type] || ListApp;
  return (
    <main className="wrap">
      <div className="app-head">
        <h1>{site.promise}</h1>
        {site.appIntro ? <p>{site.appIntro}</p> : null}
      </div>
      <App />
    </main>
  );
}
