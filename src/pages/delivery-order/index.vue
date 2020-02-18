<template>
    <div class="content-wrapper">
        <div id="delivery-order">
			<page-header titleName="Barang Masuk" :isCreate="true"></page-header>
            <div class="content">
                <div class="filterSearching clearfix">
                    <div class="input-with-icons clearfix">
                        <el-input v-model="searchQuery" class="float-left"></el-input>
                        <img :src="require('@/assets/images/icons/search1.png')">
                    </div>
					<el-date-picker
                        class="date-range-picker"
                        v-model="dateRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        :format="format"
                        :value-format="format">
					</el-date-picker>
					<el-button style="margin-left: 15px;" @click.prevent="checkIncomingItemModal = true" class="button-white-green float-right" round>Input Barang by Incoming Order Number</el-button>
					<el-button class="button-outline-green float-right" @click.prevent="getExcel" round>
						<img :src="require('@/assets/images/icons/download-new.png')" v-if="(loadingExcel == false)">
						<div class="lds-ring" v-else><div></div><div></div><div></div><div></div></div> Export
					</el-button>
                </div>
                <el-alert
                    v-if="messagesuccess"
                    title=""
                    type="success"
                    :description="messagesuccess"
                    show-icon></el-alert>
				<div class="filterstatus">
					<el-tabs v-model="filterQuery">
						<!-- <el-tab-pane label="Semua Status" name=" "></el-tab-pane> -->
						<el-tab-pane label="Pending" name="pending"></el-tab-pane>
						<el-tab-pane label="Accept" name="accept"></el-tab-pane>
					</el-tabs>
				</div>
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
					<el-table-column label="Details" width="65" type="expand">
						<template slot-scope="scope">
							<div class="mobayar-table mobayar-table-v2">
								<table style="width: 100%;" v-if="(scope.row.detail).length !== 0">
									<thead>
										<tr>
											<th width="350">Item</th>
											<th>Warna</th>
											<th>Produk</th>
											<th width="100" align="center">Qty</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(dataDetail, indexDetail) in scope.row.detail"
											:key="indexDetail">
											<td>
												<div v-if="dataDetail.item">
													<div><b>Kode</b> : {{dataDetail.item.code}}</div>
													<div><b>Name</b> : {{dataDetail.item.name}}</div>
													<div><b>N. Mesin</b> : {{dataDetail.item.machine_number}}</div>
													<div><b>N. Rangka</b> : {{dataDetail.item.chassis_number}}</div>
													<div><b>QR Code</b> : {{dataDetail.item.qrcode_serial_number}}</div>
												</div>
											</td>
											<td>
												<div v-if="dataDetail.item">
													<span v-if="dataDetail.item.colour_id !== '-'">
														{{dataDetail.item.colour.name}}
													</span>
													<span v-else>-</span>
												</div>
											</td>
											<td>
												<div v-if="dataDetail.item">
													<span v-if="dataDetail.item.product">
														{{dataDetail.item.product.name}}
													</span>
												</div>
											</td>
											<td>{{dataDetail.qty}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</template>
					</el-table-column>
                    <el-table-column label="Incoming Order Number" width="180">
						<template slot-scope="scope">
							{{scope.row.number}} <br>
							{{scope.row.inc_number}}
						</template>
					</el-table-column>
					<el-table-column label="Supplier" width="80">
                        <template slot-scope="scope">
                            <div v-if="scope.row.supplier">
                                {{(scope.row.supplier.name)}}
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column label="Warehouse" width="100">
                        <template slot-scope="scope">
                            <div v-if="scope.row.warehouse">
                                {{(scope.row.warehouse.name)}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Jumlah Barang" width="70">
                        <template slot-scope="scope">
                            <div v-if="scope.row.detail">
                                {{(scope.row.detail).length}} unit
                            </div>
                        </template>
                    </el-table-column>
					<el-table-column label="Status" width="70">
						<template slot-scope="scope">
							{{scope.row.status}}
						</template>
					</el-table-column>
                    <el-table-column label="Info Pengirim" width="190">
						<template slot-scope="scope">
							<div><b>Nama : </b> {{scope.row.delivery_name}}</div>
							<div><b>Tgl Pengirim : </b> <br>{{formatDate(scope.row.delivery_date)}} {{formatTime(scope.row.delivery_date)}}</div>
						</template>
					</el-table-column>
                    <el-table-column label="Info Penerima" width="190">
						<template slot-scope="scope">
							<div>
								<b>Nama : </b>
								<span v-if="scope.row.receipt_name !== null && scope.row.receipt_name !== ''">{{scope.row.receipt_name}}</span>
								<span v-else>-</span>
							</div>
							<div>
								<b>Tgl Penerima : </b>
								<span v-if="scope.row.receipt_date !== null && scope.row.receipt_date !== ''"><br>{{formatDate(scope.row.receipt_date)}} {{formatTime(scope.row.receipt_date)}}</span>
								<span v-else>-</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Actions" align="center">
						<template slot-scope="scope">
							<el-tooltip v-if="filterQuery == 'pending'" class="item" effect="dark" content="Accept Barang Masuk" placement="top">
								<a href="#" @click.prevent="checkIncomingProduct(scope.row.number)" style="margin-right: 8px;">
									<font-awesome-icon style="font-size: 18px" class="fontIcons" :icon="fontsIcons.check" />
								</a>
							 </el-tooltip>
							 <el-tooltip class="item" effect="dark" content="Hapus Barang Masuk" placement="top">
								<a href="#" @click.prevent="deletePost(scope.row.id)">
									<font-awesome-icon style="font-size: 18px" class="fontIcons" :icon="fontsIcons.minus" />
								</a>
							 </el-tooltip>
						</template>
					</el-table-column>
                </el-table>
                <div class="mobayar-actions-bottom clearfix">
                    <div class="showing-page float-left">
                        <span>View</span>
                        <ul>
                            <li class="active"><a href="#" @click.prevent="limitChange('10', $event)">10</a></li>
                            <li><a href="#" @click.prevent="limitChange('25', $event)">25</a></li>
                            <li><a href="#" @click.prevent="limitChange('50', $event)">50</a></li>
                            <li><a href="#" @click.prevent="limitChange('100', $event)">100</a></li>
                        </ul>
                    </div>
                    <div class="pagination-result float-right">
                        <span>Showing results 1 - {{itemsData.length}} of {{parseInt(totalPage)}}</span>
                        <el-pagination
                            layout="prev, pager, next"
                            :total="parseInt(totalPage)"
                            @current-change="pageChange"
                            :page-size="parseInt(limit)">
                        </el-pagination>
                    </div>
                </div>
                <div class="base-template-sidebar">
                    <loading-svg :isLoading="loadingForm"></loading-svg>
                    <div class="content" v-if="itemDataDetail">
                        <header class="clearfix">
                            <h4>{{titleForms}}</h4>
                            <el-button id="cancel" @click="closeModal()"><img :src="require('@/assets/images/icons/big-close.png')"></el-button>
                        </header>
                        <section>
                            <el-form :model="forms" status-icon :rules="rules" ref="formsvalid" label-width="120px" class="demo-ruleForm">
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item label="Incoming Order Number" prop="number">
                                                    <el-input
														:disabled="readOnly.number"
														v-model="forms.number"></el-input>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="12">
												<el-form-item label="Supplier" prop="supplier">
													<supplier-component
														ref="supplierComponent"
														:value="forms.supplier"
														:disabled="readOnly.supplier"></supplier-component>
												</el-form-item>
											</el-col>
											<el-col :span="12">
												<el-form-item label="Warehouse" prop="warehouse">
													<warehouse-component
														ref="warehouseComponent"
														:value="forms.warehouse"
														:disabled="readOnly.warehouse"></warehouse-component>
												</el-form-item>
											</el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nama Pengirim" prop="delivery_name">
                                                    <el-input
														:disabled="readOnly.delivery_name"
														v-model="forms.delivery_name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Tanggal Pengiriman" prop="delivery_date">
                                                    <el-date-picker
														:disabled="readOnly.delivery_date"
                                                        v-model="forms.delivery_date"
                                                        type="datetime"
                                                        format="yyyy-MM-dd HH:mm:ss"
                                                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Nama Penerima">
                                                    <el-input v-model="forms.receipt_name"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="12">
                                                <el-form-item label="Tanggal Penerimaan" prop="receipt_date">
                                                    <el-date-picker
                                                        v-model="forms.receipt_date"
                                                        type="datetime"
                                                        format="yyyy-MM-dd HH:mm:ss"
                                                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Notes">
                                                    <el-input
														:disabled="readOnly.notes"
														v-model="forms.notes"
														type="textarea"
														:rows="5"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-button class="button-white-green" @click.prevent="dialogProduk = true" round>
                                                    <span v-if="formsType !== 'edit'">Input Produk, {{formsProduct.types.length}} Barang</span>
                                                    <span v-else>Info Produk, {{formsProduct.types.length}} Barang</span>
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <!-- <el-button v-if="$dataRole['.cms.incomingitem.*.delete']" v-show="(formsType == 'edit')" class="button-outline-black" id="trash" @click.prevent="deletePost(itemDataDetail.id)">
                            <img :src="require('@/assets/images/icons/trash.png')" alt="img-trash">
                        </el-button> -->
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
                        <el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Accept</el-button>
                    </div>
                </div>

                <el-dialog
                    title="Input Produk"
                    :visible.sync="dialogProduk"
                    width="55%"
                    top="5vh"
					:close-on-click-modal="false"
					:close-on-press-escape="false"
                    :modal-append-to-body="false"
					:before-close="closeDialog"
                    class="mb-dialog nopadding-right point-modal kepala-regional">
                    <div class="content-dialog detail-pencapaian">
                        <el-alert
                            v-if="messageErrorProduct"
                            title="Error"
                            type="error"
                            :description="messageErrorProduct"
                            show-icon></el-alert>
                        <el-form :model="formsProduct" status-icon ref="formsvalid2" label-width="120px" class="demo-ruleForm">
                            <div class="item-forms-details">
                                <div class="forms-details">
                                    <div class="barang-content clearfix">
                                        <el-col :span="24">
                                            <a href="#" v-if="formsType !== 'edit'" @click.prevent="productItemsCount++" class="plus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.plus" /></a>
											<div class="items-input-product"
												v-for="(dataProduct, indexProduct) in productItemsCount"
												:key="indexProduct">
												<el-row :gutter="20">
                                            		<el-col :span="22">
														<el-form-item label="Tipe">
															<el-radio-group :disabled="readOnly.types[indexProduct]" v-model="formsProduct.types[indexProduct]">
																<el-radio
																	v-for="(dataTypes, indexTypes) in itemsType"
																	:key="indexTypes"
																	@change="typeRadio(dataTypes.slug, indexProduct)"
																	:label="dataTypes.slug">{{dataTypes.name}}</el-radio>
															</el-radio-group>
															<div class="forms-double" v-if="formsProduct.types[indexProduct] == 'e-bike' || formsProduct.types[indexProduct] == 'spare-parts'">
																<el-row :gutter="20">
																	<el-col :span="12">
																		<el-form-item label="Kode">
																			<el-input
																				:disabled="readOnly.codes[indexProduct]"
																				v-model="formsProduct.codes[indexProduct]"></el-input>
																		</el-form-item>
																	</el-col>
																	<el-col :span="12">
																		<el-form-item label="Nama">
																			<el-input
																				:disabled="readOnly.names[indexProduct]"
																				v-model="formsProduct.names[indexProduct]"></el-input>
																		</el-form-item>
																	</el-col>
																	<el-col :span="12" v-if="formsProduct.types[indexProduct] == 'e-bike'">
																		<el-form-item label="N. Mesin">
																			<el-input
																				:disabled="readOnly.machine_numbers[indexProduct]"
																				v-model="formsProduct.machine_numbers[indexProduct]"></el-input>
																		</el-form-item>
																	</el-col>
																	<el-col :span="12" v-if="formsProduct.types[indexProduct] == 'e-bike'">
																		<el-form-item label="N. Rangka">
																			<el-input
																				:disabled="readOnly.chassis_numbers[indexProduct]"
																				v-model="formsProduct.chassis_numbers[indexProduct]">
																			</el-input>
																		</el-form-item>
																	</el-col>
																	<el-col :span="12"
																		v-for="(dataItems, indexItems) in itemsProduct"
																		:key="indexItems">
																		<el-form-item v-if="dataItems.label == 'e-bike' && formsProduct.types[indexProduct] == 'e-bike'" label="Produk">
																			<el-select
																				:disabled="readOnly.product_ids[indexProduct]"
																				v-model="formsProduct.product_ids[indexProduct]"
																				filterable>
																				<el-option
																					v-for="(dataProduct, indexProduct) in dataItems.data"
																					:key="indexProduct"
																					:label="dataProduct.name"
																					:value="dataProduct.id">{{dataProduct.name}}</el-option>
																			</el-select>
																		</el-form-item>
																		<el-form-item v-if="dataItems.label == 'spare-parts' && formsProduct.types[indexProduct] == 'spare-parts'" label="Produk">
																			<el-select
																				:disabled="readOnly.product_ids[indexProduct]"
																				v-model="formsProduct.product_ids[indexProduct]"
																				filterable>
																				<el-option
																					v-for="(dataProduct, indexProduct) in dataItems.data"
																					:key="indexProduct"
																					:label="dataProduct.name"
																					:value="dataProduct.id">{{dataProduct.name}}</el-option>
																			</el-select>
																		</el-form-item>
																	</el-col>
																	<el-col :span="12" v-if="formsProduct.types[indexProduct] == 'e-bike'">
																		<el-form-item label="Warna">
																			<el-select
																				:disabled="readOnly.colour_ids[indexProduct]"
																				v-model="formsProduct.colour_ids[indexProduct]"
																				filterable>
																				<el-option
																					v-for="(dataColour, indexColour) in itemsColour"
																					:key="indexColour"
																					:label="dataColour.name"
																					:value="dataColour.id">{{dataColour.name}}</el-option>
																			</el-select>
																		</el-form-item>
																	</el-col>
																	<el-col :span="12">
																		<el-form-item label="Qty">
																			<el-input-number
																				:disabled="readOnly.qtys[indexProduct]"
																				:min="0"
																				v-model="formsProduct.qtys[indexProduct]"></el-input-number>
																		</el-form-item>
																	</el-col>
																</el-row>
															</div>
														</el-form-item>
                                            		</el-col>
													<el-col :span="2" v-if="formsType !== 'edit'">
														<a style="margin-top: 34px;display: block;margin-left: 11px;" href="#" @click.prevent="removeProductInput(indexProduct)" class="minus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" /></a>
													</el-col>
												</el-row>
											</div>
											<!-- <pre>
												{{formsProduct}}
											</pre> -->
                                            <span class="note" v-if="formsType !== 'edit'">Note: *Jika Ingin mengosongkan inputan gunakan "-"</span>
                                        </el-col>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button round class="button-white-green" @click.prevent="validationProduk()" type="primary">Confirm</el-button>
                    </span>
                </el-dialog>

				<el-dialog
                    title="Check Barang Masuk"
                    :visible.sync="checkIncomingItemModal"
                    width="35%"
                    top="5vh"
                    class="mb-dialog nopadding-right point-modal kepala-regional">
                    <div class="content-dialog detail-pencapaian" style="position: relative;">
						<loading-svg :isLoading="loadingCheck"></loading-svg>
						<div class="item-incoming-product">
							<label>Number</label>
							<el-input v-model="numberCheck"></el-input>
						</div>
                    </div>
					<span slot="footer" class="dialog-footer">
                        <el-button
							round
							class="button-white-green"
							@click.prevent="checkIncomingProduct('')"
							type="primary">Check</el-button>
                    </span>
				</el-dialog>

				<table border="1" style="width: 100%;display:none;" id="table-export-incominc-item">
                    <thead>
                        <tr>
                            <th>Incoming Order Number</th>
                            <th>Supplier</th>
                            <th>Warehouse</th>
                            <th>Jumlah Barang</th>
                            <th>Nama Pengirim</th>
							<th>Tanggal Pengirim</th>
                            <th>Nama Penerima</th>
							<th>Tanggal Penerima</th>
							<th>Item Name</th>
							<th>Nomor Mesin</th>
							<th>Nomor Rangka</th>
							<th>Warna</th>
							<th>Produk</th>
							<th>Qty</th>
                        </tr>
                    </thead>
					<tbody
						v-for="(dataExport, indexExport) in itemsDetailExcel"
						:key="indexExport">
						<tr>
							<td :rowspan="(dataExport.detail).length + 1">{{dataExport.number}}</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.supplier">
									{{dataExport.supplier.name}}
								</span>
								<span v-else>-</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.warehouse">
									{{dataExport.warehouse.name}}
								</span>
								<span v-else>-</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.detail">
									{{(dataExport.detail).length}}
								</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">{{dataExport.delivery_name}}</td>
							<td :rowspan="(dataExport.detail).length + 1">
								{{formatDate(dataExport.delivery_date)}} {{formatTime(dataExport.delivery_date)}}.
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.receipt_name !== null">{{dataExport.receipt_name}}</span>
								<span v-else>-</span>
							</td>
							<td :rowspan="(dataExport.detail).length + 1">
								<span v-if="dataExport.receipt_date !== null">{{formatDate(dataExport.receipt_date)}} {{formatTime(dataExport.receipt_date)}}.</span>
								<span v-else>-</span>

							</td>
							<td rowspan="2">
								<div v-if="dataExport.detail !== null">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.name}}</div>
								</div>
							</td>
							<td rowspan="2">
								<div v-if="dataExport.detail !== null">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.machine_number}}</div>
								</div>
							</td>
							<td rowspan="2">
								<div v-if="dataExport.detail !== null">
									<div v-if="dataExport.detail[0].item !== null">{{dataExport.detail[0].item.chassis_number}}</div>
								</div>
							</td>
							<td rowspan="2">
								<div v-if="dataExport.detail !== null">
									<div v-if="dataExport.detail[0].item !== null">
										<div v-if="dataExport.detail[0].item.colour !== null">
											{{dataExport.detail[0].item.colour.name}}
										</div>
									</div>
								</div>
							</td>
							<td rowspan="2">
								<div v-if="dataExport.detail !== null">
									<div v-if="dataExport.detail[0].item !== null">
										<div v-if="dataExport.detail[0].item.product !== null">
											{{dataExport.detail[0].item.product.name}}
										</div>
									</div>
								</div>
							</td>
							<td rowspan="2">
								<div v-if="dataExport.detail !== null">
									{{dataExport.detail[0].qty}}
								</div>
							</td>
						</tr>
						<tr v-for="(dataDetails, indexDetails) in dataExport.detail" :key="indexDetails">
                            <td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.name}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.machine_number}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.chassis_number}}</div>
                                <div v-else>-</div>
                            </td>
                            <td v-if="indexDetails > 0">
								<div v-if="dataDetails.item">
									<div v-if="dataDetails.item.colour">
										{{dataDetails.item.colour.name}}
									</div>
									<div v-else>-</div>
								</div>
								<div v-else>-</div>
							</td>
                            <td v-if="indexDetails > 0">
								<div v-if="dataDetails.item">
									<div v-if="dataDetails.item.product">
										{{dataDetails.item.product.name}}
									</div>
									<div v-else>-</div>
								</div>
								<div v-else>-</div>
							</td>
                            <td v-if="indexDetails > 0">{{dataDetails.qty}}</td>
                        </tr>
					</tbody>
				</table>
            </div>
        </div>
    </div>
</template>

<script>
import {
    faPlusCircle,
	faTrash,
	faCheckCircle
} from '@fortawesome/free-solid-svg-icons'
import XLSX from 'xlsx'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'
import warehouseComponent from './component/warehouseComponent'
import supplierComponent from './component/supplierComponent'

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

export default {
    name: 'delivery-order',
    components: { pageHeader, loadingSvg, warehouseComponent, supplierComponent },
    data(){
		var validateReceiptDate = (rule, value, callback) => {
			if(value === ''){
                callback(new Error('Inputan Harus diisi'))
            }else{
				if(value < this.forms.delivery_date){
					callback(new Error('Tanggal Penerimaan tidak boleh kurang dari tanggal pengiriman'))
				}
				callback()
			}
        }
        return{
			sectionApi: "incomingItem",
            sectionApiProductItem: "item",
            sectionApiProduct: "product",
			sectionApiColour: "colour",
			sectionApiTypes: "type",
            limit: 10,
            page: 1,
            loading: false,
            loadingForm: false,
			loadingStore: false,
			loadingExcel: false,
            itemsData: [],
            itemsProductItems: [],
            itemsProduct: [],
			itemsColour: [],
			itemsType: [],
			itemsDataCheck: [],
			itemDataDetail: [],
			itemsDetailExcel: [],
			filterQuery: "pending",
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
            messageerror: "",
            messageErrorProduct: "",
            dialogProduk: false,
			productItemsCount: 1,
			productItemsCountEdit: 0,
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
            forms: {
                number: "",
                delivery_name: "",
                delivery_date: "",
                receipt_name: "",
                receipt_date: "",
				notes: "",
				supplier: "",
				warehouse: "",
            },
            formsProduct: {
				types: [],
                chassis_numbers: [],
                machine_numbers: [],
				names: [],
				codes: [],
                product_ids: [],
				colour_ids: [],
				qtys: [],
			},
			formsProductEdit: {
                chassis_numbers: [],
                machine_numbers: [],
				names: [],
				codes: [],
                product_ids: [],
                colour_ids: [],
            },
            readOnly:{
				number: false,
                delivery_name: false,
                delivery_date: false,
				notes: false,
				supplier: false,
				warehouse: false,
				types: [],
                chassis_numbers: [],
                machine_numbers: [],
				names: [],
				codes: [],
                product_ids: [],
				colour_ids: [],
				qtys: [],
            },
            rules: {
                number: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
                delivery_name: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				delivery_date: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
				receipt_date: [ { validator: validateReceiptDate, trigger: "blur" } ],
				supplier: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
				warehouse: [ { required: true, message: "Inputan Harus diisi", trigger: "change" } ],
            },
            dataTextCreate: "Buat Barang Masuk",
            dataTextUpdate: "Edit Barang Masuk",
            confirmDescDelete: "Anda yakin akan menghapus data Barang Masuk dari daftar?",
            confirmTitleDelete: "Hapus Barang Masuk",
            textDataCreateSuccess: "Data Barang Masuk Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Barang Masuk Berhasil diupdate.",
            textDataDeleteSuccess: "1 Items Berhasil dihapus.",
            fontsIcons:{
                plus: faPlusCircle,
				minus: faTrash,
				check: faCheckCircle,
            },
			checkIncomingItemModal: false,
			numberCheck: "",
			loadingCheck: false,
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.incomingitem.get'])
    },
    mounted(){
		this.getPost()
		this.getPostType()
		this.getPostProductItem()
        this.getPostColour()
        this.initCreateFunction()
    },
    watch: {
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
		},
		filterQuery: function(){
			this.getPost()
			this.$FUNCTIONS.checkPaginations()
		},
		dateRange: function(){
			this.getPost()
			this.$FUNCTIONS.checkPaginations()
		}
    },
    methods:{
        buildUrl(value){
            if(value == true){
				return this.$baseUrl + this.sectionApi
				+ "?limit=" + this.limit
				+ "&page=" + this.page
				+ "&search=" + this.searchQuery
				+ "&status=" + this.filterQuery
				+ "&start_date=" + this.dateRange[0]
				+ "&end_date=" + this.dateRange[1]
            }else{
                return this.$baseUrl + this.sectionApi
            }
        },
        async getPost(){
            try{
                this.loading = true
                const response = await this.$services.getList(this.buildUrl(true))
                this.loading = false
                if(response.status == 200){
                    this.itemsData = response.data.data
                    this.totalPage = response.data.pagination.rowCount
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        async getPostProductItem(){
            try{
                let url = this.$baseUrl + this.sectionApiProductItem + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsProductItems = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        async getPostProduct(value, slug){
            try{
                let url = this.$baseUrl + this.sectionApiProduct + "?limit=1000&page=1&type_id=" + value
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsProduct.push({
						label: slug,
						data: response.data.data
					})
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        async getPostColour(){
            try{
                let url = this.$baseUrl + this.sectionApiColour + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsColour = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostType(){
            try{
                let url = this.$baseUrl + this.sectionApiTypes + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
					this.itemsType = response.data.data
					this.itemsType.forEach(function(e){
						this.getPostProduct(e.id, e.slug)
					}, this)
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
        },
        async postFunction(type, credentials, url) {
            if(type == "post"){
                try{
                    const response = await this.$services.postList(url, credentials)
                    document.getElementById("save").children[0].innerHTML = "Simpan"
                    if(response.status == 201) {
                        this.messagesuccess = this.textDataCreateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPost)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "put"){
                try{
                    const response = await this.$services.putList(url, credentials)
                    document.getElementById("save-edit").children[0].innerHTML = "Simpan"
                    if(response.status == 201) {
                        this.messagesuccess = this.textDataUpdateSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorPut)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if (type == "delete"){
                try{
                    const response = await this.$services.deleteList(url)
                    if(response.status == 200) {
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
                        this.closeModal()
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }
        },
        getResult: _.debounce(function(){
            this.getPost()
        }, 500),
        deletePost(id) {
            this.$confirm(this.confirmDescDelete, this.confirmTitleDelete, {
                confirmButtonText: "OK",
                cancelButtonText: "Cancel",
                type: "warning"
            }).then(() => {
                let url = this.buildUrl(false) + "/" + id
                this.postFunction("delete", "", url)
            });
        },
        handleCurrentChange(val) {
            if (val) {
                this.titleForms = this.dataTextUpdate
                this.formsType = "edit"
                this.itemDataDetail = val
                this.forms.number = this.itemDataDetail.number
				this.forms.delivery_name = this.itemDataDetail.delivery_name
				this.forms.delivery_date = this.$FUNCTIONS.formatDate(this.itemDataDetail.delivery_date) + ' ' + this.$FUNCTIONS.formatTimeUTC(this.itemDataDetail.delivery_date)
                // this.forms.receipt_name = this.itemDataDetail.receipt_name
				// this.forms.receipt_date = this.$FUNCTIONS.formatDate(this.itemDataDetail.receipt_date) + ' ' + this.$FUNCTIONS.formatTimeUTC(this.itemDataDetail.receipt_date)
				this.forms.notes = this.itemDataDetail.notes
				this.forms.supplier = this.itemDataDetail.supplier_id
				this.forms.warehouse = this.itemDataDetail.warehouse_id

				this.readOnly.number = true
                this.readOnly.delivery_name = true
                this.readOnly.delivery_date = true
				this.readOnly.notes = true
				this.readOnly.supplier = true
				this.readOnly.warehouse = true

                if(this.itemDataDetail.detail.length !== 0){
                    this.productItemsCount = this.itemDataDetail.detail.length
                    this.itemDataDetail.detail.forEach(function(e, i){
						this.readOnly.types.push(true)
                        this.readOnly.chassis_numbers.push(true)
                        this.readOnly.machine_numbers.push(true)
                        this.readOnly.names.push(true)
                        this.readOnly.product_ids.push(true)
						this.readOnly.colour_ids.push(true)
						this.readOnly.codes.push(true)
						this.readOnly.qtys.push(true)
						this.formsProduct.types.push('e-bike')
                        this.formsProduct.chassis_numbers.push(e.item.chassis_number)
                        this.formsProduct.machine_numbers.push(e.item.machine_number)
						this.formsProduct.names.push(e.item.name)
						this.formsProduct.codes.push(e.item.code)
                        this.formsProduct.product_ids.push(e.item.product_id)
						this.formsProduct.colour_ids.push(e.item.colour_id)
						this.formsProduct.qtys.push(e.qty)
                    }, this)
                }

                this.$FUNCTIONS.sidebarToggle(true)
            }
        },
        submitSave(formName, formtype) {
            let loadingform = this.$FUNCTIONS.svgSpinner
            this.messagesuccess = ""
			this.messageerror = ""
			let dataForms = {}

			if(formtype == "save") {
				dataForms['supplier_id'] = this.forms.supplier
				dataForms['warehouse_id'] = this.forms.warehouse
				dataForms['number'] = this.forms.number
				dataForms['delivery_date'] = this.forms.delivery_date
				dataForms['delivery_name'] = this.forms.delivery_name
				dataForms['receipt_date'] = this.forms.receipt_date
				dataForms['receipt_name'] = this.forms.receipt_name
				dataForms['notes'] = this.forms.notes
				// item produk
				dataForms['names'] = this.formsProduct.names
				dataForms['codes'] = this.formsProduct.codes
				dataForms['chassis_numbers'] = this.formsProduct.chassis_numbers
				dataForms['machine_numbers'] = this.formsProduct.machine_numbers
				dataForms['product_ids'] = this.formsProduct.product_ids
				dataForms['colour_ids'] = this.formsProduct.colour_ids
				dataForms['qtys'] = this.formsProduct.qtys

				dataForms = {
					supplier_id: this.forms.supplier,
					warehouse_id: this.forms.warehouse,
					number : this.forms.number,
					delivery_date : this.forms.delivery_date,
					delivery_name : this.forms.delivery_name,
					receipt_date: this.forms.receipt_date,
					receipt_name: this.forms.receipt_name,
					notes: this.forms.notes,
					chassis_numbers: this.formsProduct.chassis_numbers,
					machine_numbers: this.formsProduct.machine_numbers,
					names: this.formsProduct.names,
					codes: this.formsProduct.codes,
					product_ids: this.formsProduct.product_ids,
					colour_ids: this.formsProduct.colour_ids,
					qtys: this.formsProduct.qtys,
				}
			}else{
				dataForms = {
					receipt_date: this.forms.receipt_date,
					receipt_name: this.forms.receipt_name,
				}
			}

            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(formtype == "save") {
                        document.getElementById("save").children[0].innerHTML = loadingform
                        this.postFunction("post", dataForms, this.buildUrl(false))
                    }else{
                        document.getElementById("save-edit").children[0].innerHTML = loadingform
                        let urlv = this.buildUrl(false) + "/action/accept/" + this.itemsDataCheck.id
                        this.postFunction("put", dataForms, urlv)
                    }
                }
            })
        },
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
                        that.formsType = "create"
                        that.$FUNCTIONS.sidebarToggle(true)
                        that.getPostProductItem()
                        that.getPostProduct()
                        that.getPostColour()
                    }else{
                        that.$FUNCTIONS.notify('warning', 'Maaf', that.$textMemuatData)
                    }
                })
            }, 500)
        },
        closeModal(row) {
            this.$FUNCTIONS.sidebarToggle(false)
            this.$refs.singleTable.setCurrentRow(row)
            this.$refs.formsvalid.resetFields()
			this.productItemsCount = 1
			this.productItemsCountEdit = 0
            this.forms.number = ""
            this.forms.delivery_name = ""
            this.forms.delivery_date = ""
            this.forms.receipt_name = ""
            this.forms.receipt_date = ""
			this.forms.notes = ""
			this.forms.supplier = ""
			this.forms.warehouse = ""
			this.formsProduct.types = []
            this.formsProduct.chassis_numbers = []
            this.formsProduct.machine_numbers = []
			this.formsProduct.names = []
			this.formsProduct.codes = []
            this.formsProduct.product_ids = []
			this.formsProduct.colour_ids = []
			this.readOnly.types = []
            this.readOnly.chassis_numbers = []
            this.readOnly.machine_numbers = []
			this.readOnly.names = []
			this.readOnly.codes = []
            this.readOnly.product_ids = []
			this.readOnly.colour_ids = []
			this.readOnly.number = false
            this.readOnly.delivery_name = false
            this.readOnly.delivery_date = false
			this.readOnly.notes = false
			this.readOnly.supplier = false
			this.readOnly.warehouse = false
			this.formsProductEdit.chassis_numbers = []
			this.formsProductEdit.machine_numbers = []
			this.formsProductEdit.names = []
			this.formsProductEdit.codes = []
			this.formsProductEdit.product_ids = []
			this.formsProductEdit.colour_ids = []
			this.numberCheck = ''
		},
		closeDialog(done){
			 this.$confirm('Anda yakin akan membatalkan input produk? Data yang anda inputkan akan hilang.')
          	.then(_ => {
				done()
				if(this.formsType !== 'edit'){
					this.formsProduct.types = []
					this.formsProduct.chassis_numbers = []
					this.formsProduct.machine_numbers = []
					this.formsProduct.names = []
					this.formsProduct.codes = []
					this.formsProduct.product_ids = []
					this.formsProduct.colour_ids = []
					this.productItemsCount = 1
				}else{
					this.formsProductEdit.chassis_numbers = []
					this.formsProductEdit.machine_numbers = []
					this.formsProductEdit.names = []
					this.formsProductEdit.codes = []
					this.formsProductEdit.product_ids = []
					this.formsProductEdit.colour_ids = []
					this.productItemsCountEdit = 0
				}
			}).catch(_ => {})
		},
        formatPrice(val){
            return this.$FUNCTIONS.formatPrice(val)
        },
        limitChange(limit){
            this.limit = limit
            this.$FUNCTIONS.checkPaginations()
            this.getPost()
            this.$FUNCTIONS.viewActive()
        },
        pageChange(page){
            this.page = page
            this.getPost()
        },
		checkIfArrayIsUnique(myArray) {
			return myArray.length === new Set(myArray).size;
		},
        validationProduk(){
			if(this.formsType !== 'edit'){
				let dataCheckTipe = [],
					dataCheckChasisNumber = [],
					dataCheckMachineNumber = [],
					dataCheckNames = [],
					dataCheckProdukId = [],
					dataCheckColour = [];

				this.formsProduct.types.forEach(function(e){
					if(e == "") { dataCheckTipe.push('error') }
				}, this)

				this.formsProduct.chassis_numbers.forEach(function(e){
					if(e == "") { dataCheckChasisNumber.push('error') }
				}, this)

				this.formsProduct.machine_numbers.forEach(function(e){
					if(e == "") { dataCheckMachineNumber.push('error') }
				}, this)

				this.formsProduct.names.forEach(function(e){
					if(e == "") { dataCheckNames.push('error') }
				}, this)

				this.formsProduct.product_ids.forEach(function(e){
					if(e == "") { dataCheckProdukId.push('error') }
				}, this)

				this.formsProduct.colour_ids.forEach(function(e){
					if(e == "") { dataCheckColour.push('error') }
				}, this)


				if(dataCheckTipe.length == 0 &&
					dataCheckChasisNumber.length == 0 &&
					dataCheckMachineNumber.length == 0 &&
					dataCheckNames.length == 0 &&
					dataCheckProdukId.length == 0 &&
					dataCheckColour.length == 0){
					let data = this.formsProduct.machine_numbers
					if(this.checkIfArrayIsUnique(data) !== false){
						this.messageErrorProduct = ''
						this.dialogProduk = false
					}else{
						this.messageErrorProduct = 'Nomor Mesin yang anda inputkan sudah ada'
						document.querySelector('.el-dialog__wrapper').scrollTo(0, 0)
					}
				}else{
					this.messageErrorProduct = 'Data yang anda inputkan tidak lengkap, mohon teliti kembali'
					document.querySelector('.el-dialog__wrapper').scrollTo(0, 0)
				}
			}else{
				if((this.formsProductEdit.chassis_numbers.length == this.formsProductEdit.machine_numbers.length) &&
					(this.formsProductEdit.chassis_numbers.length == this.formsProductEdit.names.length) &&
					(this.formsProductEdit.chassis_numbers.length == this.formsProductEdit.product_ids.length) &&
					(this.formsProductEdit.chassis_numbers.length == this.formsProductEdit.colour_ids.length)){
					let data = this.formsProductEdit.machine_numbers

					if(this.checkIfArrayIsUnique(data) !== false){
						this.messageErrorProduct = ''
						this.dialogProduk = false
					}else{
						this.messageErrorProduct = 'Nomor Mesin yang anda inputkan sudah ada'
					}
				}else{
					this.messageErrorProduct = 'Mohon lengkapi kembali data produk anda'
				}
			}
        },
        removeProductInput(index){
			if(this.formsType !== 'edit'){
				this.productItemsCount--
				this.formsProduct.types.splice(index, 1)
				this.formsProduct.chassis_numbers.splice(index, 1)
				this.formsProduct.machine_numbers.splice(index, 1)
				this.formsProduct.names.splice(index, 1)
				this.formsProduct.codes.splice(index, 1)
				this.formsProduct.product_ids.splice(index, 1)
				this.formsProduct.colour_ids.splice(index, 1)
				this.formsProduct.qtys.splice(index, 1)
				this.readOnly.machine_numbers.splice(index, 1)
				this.readOnly.names.splice(index, 1)
				this.readOnly.product_ids.splice(index, 1)
				this.readOnly.colour_ids.splice(index, 1)
			}
        },
        formatDate(val){
            return this.$FUNCTIONS.formatDate(val)
        },
        formatTime(val){
            return this.$FUNCTIONS.formatTimeUTC(val)
		},
		typeRadio(slug, index){
			let that = this
			if(slug == 'spare-parts'){
				this.formsProduct.chassis_numbers.splice(index, 1, '-')
				this.formsProduct.machine_numbers.splice(index, 1, '-')
				this.formsProduct.names.splice(index, 1, '')
				this.formsProduct.codes.splice(index, 1, '')
				this.formsProduct.product_ids.splice(index, 1, '')
				this.formsProduct.colour_ids.splice(index, 1, '-')
				this.formsProduct.qtys.splice(index, 1, '')
			}else{
				this.formsProduct.chassis_numbers.splice(index, 1, '')
				this.formsProduct.machine_numbers.splice(index, 1, '')
				this.formsProduct.names.splice(index, 1, '')
				this.formsProduct.codes.splice(index, 1, '')
				this.formsProduct.product_ids.splice(index, 1, '')
				this.formsProduct.colour_ids.splice(index, 1, '')
				this.formsProduct.qtys.splice(index, 1, '')
			}
		},
		async checkIncomingProduct(value){
			this.numberCheck = value !== '' ? value : this.numberCheck
			try{
				this.loadingCheck = true
                let url = this.buildUrl(false) + "/action/check?number=" + this.numberCheck
				const response = await this.$services.getList(url)
				this.loadingCheck = false
                if(response.status == 200){
					this.itemsDataCheck = response.data
					this.checkIncomingItemModal = false
					this.handleCurrentChange(this.itemsDataCheck)
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
				this.loadingCheck = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getExcel(){
			if(this.itemsData.length != 0){
				try{
					this.loadingExcel = true
					this.limit = this.totalPage
					this.page = 1
					let url = this.buildUrl(true)
					const response = await this.$services.getList(url)
					this.loadingExcel = false
					if(response.status == 200){
						this.itemsDetailExcel = response.data.data

						let that = this
						setTimeout(function(){
							that.loadingExcel = false
							var wscols = [
								{wch:25},
								{wch:15},
								{wch:15},
								{wch:15},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:15},
								{wch:20},
								{wch:15},
								{wch:10},
								{wch:15},
								{wch:10},
							];
							var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-incominc-item'))
							datas['!cols'] = wscols;
							var wb = XLSX.utils.book_new()
							let filename = "barang-masuk"
							XLSX.utils.book_append_sheet(wb, datas, 'Barang Masuk')
							XLSX.writeFile(wb, filename+'.xlsx')
						}, 1000)
					}else{
						this.$FUNCTIONS.checkErrorResponse(response.status)
					}
				}catch(err){
					this.loadingExcel = false
					this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
				}
			}else{
				this.$FUNCTIONS.notify('error', 'Maaf', 'Data Kosong')
			}
		}
    }
}
</script>
<style lang="scss" scoped>
.choose-button, .input-button{
	display: inline-block;
	color: #FFFFFF;
	background: #800080;
	border: 1px solid #800080;
	padding: 5px 7px;
	border-radius: 5px;
	font-size: 12px;
}
.note{
    color: #800080;
    font-size: 12px;
    font-weight: 600;
    display: block;
    margin-top: 10px;
}
.barang-content{
    position: relative;
}
.plus-items{
    position: absolute;
    right: -15px;
    z-index: 10;
    top: -10px;
    .fontIcons{
        font-size: 24px;
        color: #800080 !important;
    }
}
.minus-items{
    .fontIcons{
        font-size: 16px !important;
        color: #800080 !important;
    }
}
</style>
