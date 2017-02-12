/**
 * @fileoverview This file is generated by the Angular 2 template compiler.
 * Do not edit.
 * @suppress {suspiciousCode,uselessCode,missingProperties}
 */
 /* tslint:disable */

import * as import0 from './repo-detail.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import2 from '@angular/core/src/render/api';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/change_detection';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../shared/github.service';
import * as import9 from '@angular/router/src/router_state';
import * as import10 from './repo-detail.component.css.shim';
import * as import11 from '@angular/common/src/pipes/json_pipe';
export class Wrapper_RepoDetailComponent {
  /*private*/ _eventHandler:Function;
  context:import0.RepoDetailComponent;
  /*private*/ _changed:boolean;
  constructor(p0:any,p1:any) {
    this._changed = false;
    this.context = new import0.RepoDetailComponent(p0,p1);
  }
  ngOnDetach(view:import1.AppView<any>,componentView:import1.AppView<any>,el:any):void {
  }
  ngOnDestroy():void {
  }
  ngDoCheck(view:import1.AppView<any>,el:any,throwOnChange:boolean):boolean {
    var changed:any = this._changed;
    this._changed = false;
    if (!throwOnChange) { if ((view.numberOfChecks === 0)) { this.context.ngOnInit(); } }
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
var renderType_RepoDetailComponent_Host:import2.RenderComponentType = import3.createRenderComponentType('',0,import4.ViewEncapsulation.None,([] as any[]),{});
class View_RepoDetailComponent_Host0 extends import1.AppView<any> {
  _el_0:any;
  compView_0:import1.AppView<import0.RepoDetailComponent>;
  _RepoDetailComponent_0_3:Wrapper_RepoDetailComponent;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_RepoDetailComponent_Host0,renderType_RepoDetailComponent_Host,import5.ViewType.HOST,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways);
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer,'repo-detail',import3.EMPTY_INLINE_ARRAY,rootSelector,(null as any));
    this.compView_0 = new View_RepoDetailComponent0(this.viewUtils,this,0,this._el_0);
    this._RepoDetailComponent_0_3 = new Wrapper_RepoDetailComponent(this.injectorGet(import8.GithubService,this.parentIndex),this.injectorGet(import9.ActivatedRoute,this.parentIndex));
    this.compView_0.create(this._RepoDetailComponent_0_3.context);
    this.init(this._el_0,((<any>this.renderer).directRenderer? (null as any): [this._el_0]),(null as any));
    return new import7.ComponentRef_<any>(0,this,this._el_0,this._RepoDetailComponent_0_3.context);
  }
  injectorGetInternal(token:any,requestNodeIndex:number,notFoundResult:any):any {
    if (((token === import0.RepoDetailComponent) && (0 === requestNodeIndex))) { return this._RepoDetailComponent_0_3.context; }
    return notFoundResult;
  }
  detectChangesInternal(throwOnChange:boolean):void {
    this._RepoDetailComponent_0_3.ngDoCheck(this,this._el_0,throwOnChange);
    this.compView_0.detectChanges(throwOnChange);
  }
  destroyInternal():void {
    this.compView_0.destroy();
  }
  visitRootNodesInternal(cb:any,ctx:any):void {
    cb(this._el_0,ctx);
  }
}
export const RepoDetailComponentNgFactory:import7.ComponentFactory<import0.RepoDetailComponent> = new import7.ComponentFactory<import0.RepoDetailComponent>('repo-detail',View_RepoDetailComponent_Host0,import0.RepoDetailComponent);
const styles_RepoDetailComponent:any[] = [import10.styles];
var renderType_RepoDetailComponent:import2.RenderComponentType = import3.createRenderComponentType('',0,import4.ViewEncapsulation.Emulated,styles_RepoDetailComponent,{});
export class View_RepoDetailComponent0 extends import1.AppView<import0.RepoDetailComponent> {
  _el_0:any;
  _text_1:any;
  _text_2:any;
  _el_3:any;
  _text_4:any;
  _text_5:any;
  /*private*/ _expr_6:any;
  /*private*/ _expr_7:any;
  _pipe_json_0:import11.JsonPipe;
  constructor(viewUtils:import3.ViewUtils,parentView:import1.AppView<any>,parentIndex:number,parentElement:any) {
    super(View_RepoDetailComponent0,renderType_RepoDetailComponent,import5.ViewType.COMPONENT,viewUtils,parentView,parentIndex,parentElement,import6.ChangeDetectorStatus.CheckAlways);
    this._expr_6 = import6.UNINITIALIZED;
    this._expr_7 = import6.UNINITIALIZED;
  }
  createInternal(rootSelector:string):import7.ComponentRef<any> {
    const parentRenderNode:any = this.renderer.createViewRoot(this.parentElement);
    this._el_0 = import3.createRenderElement(this.renderer,parentRenderNode,'h2',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_1 = this.renderer.createText(this._el_0,'',(null as any));
    this._text_2 = this.renderer.createText(parentRenderNode,'\n\n',(null as any));
    this._el_3 = import3.createRenderElement(this.renderer,parentRenderNode,'pre',import3.EMPTY_INLINE_ARRAY,(null as any));
    this._text_4 = this.renderer.createText(this._el_3,'',(null as any));
    this._text_5 = this.renderer.createText(parentRenderNode,'\n',(null as any));
    this._pipe_json_0 = new import11.JsonPipe();
    this.init((null as any),((<any>this.renderer).directRenderer? (null as any): [
      this._el_0,
      this._text_1,
      this._text_2,
      this._el_3,
      this._text_4,
      this._text_5
    ]
    ),(null as any));
    return (null as any);
  }
  detectChangesInternal(throwOnChange:boolean):void {
    const valUnwrapper:any = new import6.ValueUnwrapper();
    const currVal_6:any = import3.inlineInterpolate(1,'',this.context.repoDetails.full_name,'');
    if (import3.checkBinding(throwOnChange,this._expr_6,currVal_6)) {
      this.renderer.setText(this._text_1,currVal_6);
      this._expr_6 = currVal_6;
    }
    valUnwrapper.reset();
    const currVal_7:any = import3.inlineInterpolate(1,'this.repoDetails = ',valUnwrapper.unwrap(this._pipe_json_0.transform(this.context.repoDetails)),'');
    if ((valUnwrapper.hasWrappedValue || import3.checkBinding(throwOnChange,this._expr_7,currVal_7))) {
      this.renderer.setText(this._text_4,currVal_7);
      this._expr_7 = currVal_7;
    }
  }
}