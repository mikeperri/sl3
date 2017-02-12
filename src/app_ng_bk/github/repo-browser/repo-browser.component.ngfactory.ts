/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */

import * as import0 from './repo-browser.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import2 from '@angular/core/src/render/api';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/change_detection';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '@angular/router/src/router';
import * as import9 from '../shared/github.service';
import * as import10 from './repo-browser.component.css.shim';
import * as import11 from '@angular/core/src/linker/view_container';
import * as import12 from '../../../../node_modules/@angular/router/src/directives/router_outlet.ngfactory';
import * as import13 from '@angular/router/src/router_outlet_map';
import * as import14 from '@angular/core/src/linker/component_factory_resolver';
import * as import15 from '@angular/router/src/directives/router_outlet';
export class Wrapper_RepoBrowserComponent {
  /*private*/ _eventHandler:Function;
  context:import0.RepoBrowserComponent;
  /*private*/ _changed:boolean;
  constructor(p0:any,p1:any) {
    this._changed = false;
    this.context = new import0.RepoBrowserComponent(p0,p1);
  }
  ngOnDetach(view:import1.AppView<any>,componentView:import1.AppView<any>,el:any):void {
  }
  ngOnDestroy():void {
  }
  ngDoCheck(view:import1.AppView<any>,el:any,throwOnChange:boolean):boolean {
    var changed:any = this._changed;
    this._changed = false;
    return changed;
  }
  checkHost(view:import1.AppView<any>,componentView:import1.AppView<any>,el:any,throwOnChange:boolean):void {
  }
  handleEvent(eventName:string,$event:any):boolean {
    var result:boolean = true;
    return result;
  }
  subscribe(view:import1.AppView<any>,_eventHandler:any):void {
    this._eventHandler = _eventHandler;
  }
}
var renderType_RepoBrowserComponent_Host:import2.RenderComponentType = import3.createRenderComponentType('',0,import4.ViewEncapsulation.None,([] as any[]),{});
class View_RepoBrowserComponent_Host0 extends import1.AppView<any> {
  _el_0:any;
  compView_0:import1.AppView<import0.RepoBrowserComponent>;
  _RepoBrowserComponent_0_3:Wrapper_RepoBrowserComponent;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_RepoBrowserComponent_Host0,renderType_RepoBrowserComponent_Host,import5.ViewType.HOST,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer,'repo-browser',import3.EMPTY_INLINE_ARRAY,rootSelector,(null as any));
    this.compView_0 = new View_RepoBrowserComponent0(this.viewUtils,this,0,this._el_0);
    this._RepoBrowserComponent_0_3 = new Wrapper_RepoBrowserComponent(this.injectorGet(import8.Router,this.parentIndex),this.injectorGet(import9.GithubService,this.parentIndex));
    this.compView_0.create(this._RepoBrowserComponent_0_3.context);
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return new import7.ComponentRef_<any>(0,this,this._el_0,this._RepoBrowserComponent_0_3.context);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import0.RepoBrowserComponent) && (0 === requestNodeIndex))) { return this._RepoBrowserComponent_0_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this._RepoBrowserComponent_0_3.ngDoCheck(this,this._el_0,throwOnChange);
    this.compView_0.detectChanges(throwOnChange);
  }
  destroyInternal():void {
    this.compView_0.destroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
export const RepoBrowserComponentNgFactory:import7.ComponentFactory<import0.RepoBrowserComponent> = new import7.ComponentFactory<import0.RepoBrowserComponent>('repo-browser',View_RepoBrowserComponent_Host0,import0.RepoBrowserComponent);
const styles_RepoBrowserComponent:any[] = [import10.styles];
var renderType_RepoBrowserComponent:import2.RenderComponentType = import3.createRenderComponentType('',0,import4.ViewEncapsulation.Emulated,styles_RepoBrowserComponent,{});
export class View_RepoBrowserComponent0 extends import1.AppView<import0.RepoBrowserComponent> {
  _el_0:any;
  _text_1:any;
  _text_2:any;
  _el_3:any;
  _text_4:any;
  _el_5:any;
  _text_6:any;
  _text_7:any;
  _el_8:any;
  /*private*/ _vc_8:import11.ViewContainer;
  _RouterOutlet_8_5:import12.Wrapper_RouterOutlet;
  _text_9:any;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_RepoBrowserComponent0,renderType_RepoBrowserComponent,import5.ViewType.COMPONENT,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    const parentRenderNode:any = this.renderer.createViewRoot(this.parentElement);
    this._el_0 = import3.createRenderElement(this.renderer,parentRenderNode,'h3',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'GitHub Browser',(null as any));
    this._text_2 = this.renderer.createText(parentRenderNode,'\n\n',(null as any));
    this._el_3 = import3.createRenderElement(this.renderer,parentRenderNode,'input',new import3.InlineArray4(4,'placeholder','Search Github Orgs','type','text'),(null as any));
    this._text_4 = this.renderer.createText(parentRenderNode,'\n',(null as any));
    this._el_5 = import3.createRenderElement(this.renderer,parentRenderNode,'button',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_6 = this.renderer.createText(this._el_5,'Search Orgs',(null as any));
    this._text_7 = this.renderer.createText(parentRenderNode,'\n\n',(null as any));
    this._el_8 = import3.createRenderElement(this.renderer,parentRenderNode,'router-outlet',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._vc_8 = new import11.ViewContainer(8,(null as any),this,this._el_8);
    this._RouterOutlet_8_5 = new import12.Wrapper_RouterOutlet(this.parentView.injectorGet(import13.RouterOutletMap,this.parentIndex),this._vc_8.vcRef,this.parentView.injectorGet(import14.ComponentFactoryResolver,this.parentIndex),(null as any));
    this._text_9 = this.renderer.createText(parentRenderNode,'\n',(null as any));
    var disposable_0:Function = import3.subscribeToRenderElement(this,this._el_5,new import3.InlineArray2(2,'click',(null as any)),this.eventHandler(this.handleEvent_5));
    this.init((null as any),((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._text_2,
      this._el_3,
      this._text_4,
      this._el_5,
      this._text_6,
      this._text_7,
      this._el_8,
      this._text_9
    ]
    ),[disposable_0]);
    return (null as any);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import15.RouterOutlet) && (8 === requestNodeIndex))) { return this._RouterOutlet_8_5.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this._RouterOutlet_8_5.ngDoCheck(this,this._el_8,throwOnChange);
    this._vc_8.detectChangesInNestedViews(throwOnChange);
  }
  destroyInternal():void {
    this._vc_8.destroyNestedViews();
    this._RouterOutlet_8_5.ngOnDestroy();
  }
  handleEvent_5(eventName:string,$event:any):boolean {
    this.markPathToRootAsCheckOnce();
    var result:boolean = true;
    if ((eventName == 'click')) {
      const pd_sub_0:any = ((<any>this.context.searchForOrg(this._el_3.value)) !== false);
      result = (pd_sub_0 && result);
    }
    return result;
  }
}