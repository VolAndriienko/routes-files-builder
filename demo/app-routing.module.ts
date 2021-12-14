import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from "./start/start.component";
import { ServiceComponent } from "./service/service.component";
import { TeamComponent } from "./team/team.component";
import { LvdComponent } from "./lvd/lvd.component";
import { MfrComponent } from "./mfr/mfr.component";
import { PslComponent } from "./psl/psl.component";
import { GraComponent } from "./gra/gra.component";
import { EdiComponent } from "./edi/edi.component";
import { SapComponent } from "./sap/sap.component";
import { LvsComponent } from "./lvs/lvs.component";
import { GigasetComponent } from "./gigaset/gigaset.component";
import { BarcodeUndRfidComponent } from "./barcode-und-rfid/barcode-und-rfid.component";
import { ErrorComponent } from "./error/error.component";
import { ImprintComponent } from "./imprint/imprint.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { ContentComponent } from './content/content.component';
import { CareerComponent } from "./career/career.component";
import { JobDescriptionComponent } from "./job-description/job-description.component";
import { langDecideConst } from 'langs-navigation';

const routes: Routes = [
  {
    path: ':lang', component: ContentComponent,
    children: [
      { path: "", component: StartComponent, pathMatch: 'full' },
      { path: 'service', component: ServiceComponent, pathMatch: 'full' },
      { path: 'team', component: TeamComponent, pathMatch: 'full' },
      { path: 'lvd', component: LvdComponent, pathMatch: 'full' },
      { path: "mfr", component: MfrComponent, pathMatch: 'full' },
      { path: `psl`, component: PslComponent, pathMatch: 'full' },
      { path: 'gra', component: GraComponent, pathMatch: 'full' },
      { path: 'edi', component: EdiComponent, pathMatch: 'full' },
      { path: 'sap-support', component: SapComponent, pathMatch: 'full' },
      { path: 'lvs', component: LvsComponent, pathMatch: 'full' },
      { path: 'gigaset', component: GigasetComponent, pathMatch: 'full' },
      { path: 'barcode', component: BarcodeUndRfidComponent, pathMatch: 'full' },
      { path: 'imprint', component: ImprintComponent, pathMatch: 'full' }, // robots-disallowed sitemap-ignore
      { path: 'privacy', component: PrivacyComponent, pathMatch: 'full' }, // robots-disallowed sitemap-ignore
      { path: 'career', component: CareerComponent, pathMatch: 'full' }, // sitemap-only-for-langs:de
      { path: 'job-description/:position', component: JobDescriptionComponent, pathMatch: 'full' }, //sitemap-ignore
      { path: 'not-found', component: ErrorComponent, pathMatch: 'full' }, // robots-disallowed  sitemap-ignore
      { path: '**', component: ErrorComponent } // Wildcard route for a 404 page // sitemap-ignore
    ]
  },
  { path: '', redirectTo: '/' + langDecideConst, pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
