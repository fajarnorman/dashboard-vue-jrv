<template>
    <div class="content-wrapper">
        <div id="delivery-sale">
            <page-header titleName="Surat Jalan" :isCreate="true"></page-header>
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
                <el-table
                    :data="itemsData"
                    max-height="530"
                    empty-text="No data available in table"
                    ref="singleTable"
                    v-loading="loading"
                    class="mobayar-table">
					<!-- <el-table-column type="selection" width="55"></el-table-column> -->
					<el-table-column label="Details" width="70" type="expand">
						<template slot-scope="scope">
							<div class="mobayar-table mobayar-table-v2">
								<table style="width: 100%;" v-if="(scope.row.details).length !== 0">
									<thead>
										<tr>
											<th width="350">Item</th>
											<th width="100" align="center">Qty</th>
											<th>Price</th>
											<th>Discount</th>
											<th>Subtotal</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(dataDetail, indexDetail) in scope.row.details"
											:key="indexDetail">
											<td>
												<div v-if="dataDetail.item">
													<div><b>Nama</b> : {{dataDetail.item.name}}</div>
													<div><b>Nomor Mesin</b> : {{dataDetail.item.machine_number}}</div>
													<div><b>Nomor Rangka</b> : {{dataDetail.item.chassis_number}}</div>
													<div>
														<b>Warna</b> :
														<span v-if="dataDetail.item.colour">
															{{dataDetail.item.colour.name}}
														</span>
													</div>
												</div>
											</td>
											<td>{{dataDetail.qty}}</td>
											<td>Rp. {{formatPrice(dataDetail.price)}}</td>
											<td>Rp. {{formatPrice(dataDetail.discount)}}</td>
											<td>Rp. {{formatPrice(dataDetail.subtotal)}}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</template>
					</el-table-column>
                    <el-table-column label="Nomor Surat Jalan" width="140" prop="number"></el-table-column>
					<el-table-column label="Nomor Invoice" width="150">
						<template slot-scope="scope">
							<span v-if="scope.row.invoice_number !== null && scope.row.invoice_number !== ''">
								{{scope.row.invoice_number}}
							</span>
							<span v-else>-</span>
						</template>
					</el-table-column>
					<el-table-column label="Tipe" prop="type"></el-table-column>
					<el-table-column label="Shipping fee" width="120">
						<template slot-scope="scope">
							Rp. {{formatPrice(scope.row.shipping_fee)}}
						</template>
					</el-table-column>
					<el-table-column label="Total Unit" width="120">
						<template slot-scope="scope">
							{{scope.row.total_unit}} Unit
						</template>
					</el-table-column>
					<el-table-column label="Data Invoice" width="250">
						<template slot-scope="scope">
							<div v-if="scope.row.purchase_order">
								<div><b>Number PO</b> : {{scope.row.purchase_order.number}}</div>
								<div><b>Buyer</b> : {{scope.row.purchase_order.buyer}}</div>
								<div><b>Nama Sales</b> : {{scope.row.purchase_order.seller}}</div>
								<div><b>Tipe</b> : {{scope.row.purchase_order.type}}</div>
								<div><b>Total PO</b> : {{scope.row.purchase_order.total_idr}}</div>
								<div>
									<b>Tanggal Invoice</b> :
									<span v-if="scope.row.invoice_date !== null">{{scope.row.invoice_date | moment('DD-MMM-YYYY')}}</span>
									<span v-else>-</span>
								</div>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="Created At" width="100">
						<template slot-scope="scope">
							{{scope.row.created_at | moment("YYYY-MM-DD, H:mm:ss")}}
						</template>
					</el-table-column>
					<el-table-column label="Update At" width="100">
						<template slot-scope="scope">
							{{scope.row.updated_at | moment("YYYY-MM-DD, H:mm:ss")}}
						</template>
					</el-table-column>
					<el-table-column label="Actions" align="center" width="140">
						<template slot-scope="scope">
							<a href="#" style="margin-right: 8px;" @click.prevent="
								modalDeleteSuratJalan = true
								modalDeleteIdSuratJalan = scope.row.id
							">
								<el-tooltip class="item" effect="dark" content="Delete Surat Jalan" placement="top">
									<font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.minus" />
								</el-tooltip>
							</a>
							<a href="#" style="margin-right: 5px;" @click.prevent="handleCurrentChange(scope.row)">
								<el-tooltip class="item" effect="dark" content="Edit Surat Jalan" placement="top">
									<font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.edit" />
								</el-tooltip>
							</a>
							<a href="#" style="margin-right: 8px;" @click.prevent="openNotesModal(scope.row, false)">
								<el-tooltip class="item" effect="dark" content="Print Surat Jalan" placement="top">
									<font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.print" />
								</el-tooltip>
							</a>
							<a href="#" @click.prevent="openNotesModal(scope.row, true)">
								<el-tooltip class="item" effect="dark" content="Print Proforma Invoice" placement="top">
									<font-awesome-icon style="font-size: 18px;" class="fontIcons" :icon="fontsIcons.printInvoice" />
								</el-tooltip>
							</a>
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
									<h5 style="margin-bottom: 10px;">Periode Purchase Order</h5>
									<div class="forms-details" style="margin-top:0;">
										<el-row :gutter="20">
											<el-col :span="24">
												<el-row :gutter="20">
													<el-col :span="12" style="margin-bottom: 0;">
														<div class="select-prepend">
															<div class="el-input-group__prepend">Start Date</div>
															<el-select
																:disabled="formsType === 'edit'"
																@change="periodChange"
																v-model="forms.periodFirstPO">
																<el-option
																	v-for="(data, index) in getYearData"
																	:key="index"
																	:value="data"
																	:label="data"></el-option>
															</el-select>
														</div>
													</el-col>
													<el-col :span="12" style="margin-bottom: 0;">
														<el-input disabled v-model="forms.periodLastPO">
															<template slot="prepend">End Date</template>
														</el-input>
													</el-col>
												</el-row>
											</el-col>
										</el-row>
									</div>
								</div>
                                <div class="item-forms-details">
                                    <div class="forms-details">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <el-form-item :label="(forms.periodFirstPO === forms.periodLastPO) ? ('Data Purchase Order (' + forms.periodFirstPO + ')') : ('Data Purchase Order (' + forms.periodFirstPO + '-' + forms.periodLastPO + ')')">
													<el-select
														@change="purchaseOrderChange"
														v-model="forms.purchase_order"
														:disabled="(formsType !== 'create') ? true : false"
														filterable>
														<el-option
															v-for="itemPO in itemsDataPurchaseOrder"
															:key="itemPO.id"
															:label="itemPO.number"
															:value="itemPO.id">
														</el-option>
													</el-select>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="24">
                                                <el-form-item label="Tipe">
													<el-radio-group v-model="forms.type">
														<el-radio label="sale">Sale</el-radio>
														<el-radio label="display">Display</el-radio>
													</el-radio-group>
                                                </el-form-item>
                                            </el-col>
											<el-col :span="24">
												<el-form-item label="Biaya Pengiriman">
													<div class="el-input">
														<money
															v-model="forms.shippingFee"
															v-bind="money"
															class="el-input__inner"></money>
													</div>
												</el-form-item>
											</el-col>
                                        </el-row>
                                    </div>
                                </div>
								<div class="item-forms-details">
									<h5>Input Produk Item</h5>
									<div class="forms-details" style="position: relative;">
										<el-table
											:data="formsProduct.checked_items"
											max-height="530"
											:empty-text="emptyTextProduct"
											ref="singleTableItems"
											v-loading="loading"
											class="mobayar-table"
											@selection-change="handleSelectionChange">
											<el-table-column type="selection" width="65"></el-table-column>
											<el-table-column label="Produk" width="130">
												<template slot-scope="scope">
													<div v-if="scope.row.data">
														<span v-if="scope.row.data.product">{{scope.row.data.product.name}}</span>
														<span v-if="scope.row.data.colour">- {{scope.row.data.colour.name}}</span>
													</div>
												</template>
											</el-table-column>
											<el-table-column label="Item">
												<template slot-scope="scope">
													<el-button
														v-if="formsProduct.item_fake[scope.$index] == '' && scope.row.data.status !== 'success'"
														class="button-white-green"
														round
														@click.prevent="openModelItem(scope.row.data, scope.$index)">Pilih Item</el-button>
													<div v-else>
														<div v-if="formsProduct.item_fake[scope.$index]">
															<div>
																<b>Kode</b> : {{formsProduct.item_fake[scope.$index].code}}
															</div>
															<div>
																<b>Nama</b> : {{formsProduct.item_fake[scope.$index].name}}
															</div>
															<div>
																<b>N. Rangka</b> : {{formsProduct.item_fake[scope.$index].chassis_number}}
															</div>
															<div>
																<b>N. Mesin</b> : {{formsProduct.item_fake[scope.$index].machine_number}}
															</div>
															<div>
																<b>Warna</b> :
																<span v-if="formsProduct.item_fake[scope.$index].colour">{{formsProduct.item_fake[scope.$index].colour.name}}</span>
															</div>
															<div v-if="scope.row.data.status !== 'success'">
																<a href="#" @click.prevent="openModelItem(scope.row.data, scope.$index)">Change Item</a>
															</div>
														</div>
														<div v-else>-</div>
													</div>
												</template>
											</el-table-column>
											<el-table-column label="Status">
												<template slot-scope="scope">
													<div v-if="scope.row.data">
														<span class="badge inline success" v-if="scope.row.data.status == 'success'">{{scope.row.data.status}}</span>
														<span class="badge inline pending" v-else>{{scope.row.data.status}}</span>
													</div>
												</template>
											</el-table-column>
											<!-- <el-table-column v-if="formsType !== 'edit'" label="Hapus">
												<template slot-scope="scope">
													<a href="#" @click.prevent="removeProductInput(scope.$index)" class="minus-items"><font-awesome-icon class="fontIcons" :icon="fontsIcons.minus" /></a>
												</template>
											</el-table-column> -->
										</el-table>
										<el-row :gutter="20" style="margin-top: 25px;">
											<el-col :span="24">
												<el-form-item label="Total Unit">
													<el-input-number :min="0" v-model="totalUnit"></el-input-number>
												</el-form-item>
											</el-col>
											<!-- <el-col :span="24">
												<pre>{{formsProduct.checked_items}}</pre>
											</el-col> -->
										</el-row>
									</div>
								</div>
                            </el-form>
                        </section>
                    </div>
                    <div class="actions-button clearfix">
                        <el-button class="button-outline-black" @click="closeModal()">Batal</el-button>
                        <el-button v-show="(formsType != 'edit')" class="button-white-green" id="save" @click.prevent="submitSave('formsvalid', 'save')">Simpan</el-button>
						<el-button v-show="(formsType == 'edit')" class="button-white-green" id="save-edit" @click.prevent="submitSave('formsvalid', 'edit')">Simpan</el-button>
                    </div>
                </div>

				<table border="1" style="width: 100%;display:none;" id="table-export-sale">
					<thead>
                        <tr>
                            <th>Nomor Surat Jalan</th>
							<th>Nomor PO</th>
							<th>Tanggal PO</th>
							<th>Nomor Invoice</th>
							<th>Tanggal Invoice</th>
                            <th>Tipe</th>
							<th>Total Unit</th>
							<th>PIC</th>
							<th>Toko</th>
							<th>Alamat Toko</th>
							<th>Tanggal Created At</th>
							<th>Waktu Created At</th>
							<th>Nama Item</th>
							<th>Kode Item</th>
							<th>Nomor Rangka Item</th>
							<th>Nomor Mesin Item</th>
							<th>Qty Item</th>
							<th>Harga</th>
                        </tr>
                    </thead>
					<tbody
						v-for="(dataExport, indexExport) in itemDataExcel"
						:key="indexExport">
						<tr>
                            <td :rowspan="(dataExport.details).length + 1">
								{{dataExport.number}}
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.purchase_order">
									{{dataExport.purchase_order.number}}
								</div>
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.purchase_order">
									{{$FUNCTIONS.formatDate(dataExport.purchase_order.created_at)}}
								</div>
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.invoice_number !== null">{{dataExport.invoice_number}}</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.invoice_date !== null">{{$FUNCTIONS.formatDate(dataExport.invoice_date)}}</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								{{dataExport.type}}
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								{{dataExport.total_unit}}
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.purchase_order.buyer !== null">
									<span>{{dataExport.purchase_order.buyer}}</span>
								</div>
								<div v-else>
									<span>
										<div v-if="dataExport.purchase_order.type == 'store'">
											<div v-if="dataExport.purchase_order.store">
												<span v-if="dataExport.purchase_order.store.pic !== null">{{dataExport.purchase_order.store.pic}}</span>
												<span v-else>-</span>
											</div>
										</div>
										<div v-else>-</div>
									</span>
								</div>
							</td>
							<!-- <td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.purchase_order.phone && dataExport.purchase_order.phone !== null && dataExport.purchase_order.phone !== ''">
									{{dataExport.purchase_order.phone}}
								</div>
								<div v-else>
									<div>
										<div v-if="dataExport.purchase_order.type == 'store'">
											<div v-if="dataExport.purchase_order.store">
												<span v-if="dataExport.purchase_order.store.phone !== null">{{dataExport.purchase_order.store.phone}}</span>
												<span v-else>-</span>
											</div>
										</div>
										<div v-else>-</div>
									</div>
								</div>
							</td> -->
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.purchase_order.type == 'store'">
									<div v-if="dataExport.purchase_order.store">
										{{dataExport.purchase_order.store.name}}
									</div>
									<div v-else>-</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								<div v-if="dataExport.purchase_order.address && dataExport.purchase_order.address !== null && dataExport.purchase_order.address !== ''">
									<div>
										{{dataExport.purchase_order.address}}
									</div>
								</div>
								<div v-else>
									<div>
										<div v-if="dataExport.purchase_order.type == 'store'">
											<div v-if="dataExport.purchase_order.store">
												<span v-if="dataExport.purchase_order.store.address !== null">{{dataExport.purchase_order.store.address}}</span>
												<span v-else>-</span>
											</div>
										</div>
										<div v-else>-</div>
									</div>
								</div>
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								{{$FUNCTIONS.formatDate(dataExport.created_at)}}
							</td>
							<td :rowspan="(dataExport.details).length + 1">
								{{$FUNCTIONS.formatTime(dataExport.created_at)}}
							</td>
							<td :rowspan="((dataExport.details).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.details).length !== 0">
									<div v-if="dataExport.details[0].item !== null">{{dataExport.details[0].item.name}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.details).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.details).length !== 0">
									<div v-if="dataExport.details[0].item !== null">{{dataExport.details[0].item.code}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.details).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.details).length !== 0">
									<div v-if="dataExport.details[0].item !== null">{{dataExport.details[0].item.chassis_number}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.details).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.details).length !== 0">
									<div v-if="dataExport.details[0].item !== null">{{dataExport.details[0].item.machine_number}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.details).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.details).length !== 0">
									<div v-if="dataExport.details[0].qty !== null">{{dataExport.details[0].qty}}</div>
								</div>
								<div v-else>-</div>
							</td>
							<td :rowspan="((dataExport.details).length !== 0) ? '2' : '1'">
								<div v-if="(dataExport.details).length !== 0">
									<div v-if="dataExport.details[0].price !== null">{{dataExport.details[0].price}}</div>
								</div>
								<div v-else>-</div>
							</td>
						</tr>
						<tr v-for="(dataDetails, indexDetails) in dataExport.details" :key="indexDetails">
                            <td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.name}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.code}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.chassis_number}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.item">{{dataDetails.item.machine_number}}</div>
                                <div v-else>-</div>
                            </td>
                            <td v-if="indexDetails > 0">
                                <div v-if="dataDetails.qty">{{dataDetails.qty}}</div>
                                <div v-else>-</div>
                            </td>
							<td v-if="indexDetails > 0">
                                <div v-if="dataDetails.price">{{dataDetails.price}}</div>
                                <div v-else>-</div>
                            </td>
                        </tr>
					</tbody>
				</table>
            </div>
			<el-dialog
				title="Note Surat Jalan"
				:visible.sync="modelNotesItem"
				width="40%"
				top="5vh"
				class="mb-dialog nopadding-right point-modal kepala-regional">
				<div class="content-dialog detail-pencapaian">
					<label>Note</label>
					<!-- <el-input type="textarea" rows="5" v-model="notesPrintItem"></el-input> -->
					<summernote
						class="form-control"
						name="editor"
						:model="notesPrintItem"
						:toolbar="toolbarEditorConfig"
						height="200"
						v-on:change="value => { notesPrintItem = value }">
					</summernote>
					<span class="note" style="font-size: 11px;color:#800080;">*kolom di atas tidak wajib di isi</span>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button round class="button-white-green" @click.prevent="printSuratJalan(itemDataPrint)" type="primary">Print</el-button>
				</span>
			</el-dialog>
			<el-dialog
				:title="'Pilih Item untuk Produk ' + modalItemTitle"
				:visible.sync="modalItem"
				width="50%"
				top="5vh"
				class="mb-dialog nopadding-right point-modal kepala-regional">
				<div class="content-dialog detail-pencapaian" style="overflow: visible;">
					<loading-svg :isLoading="loadingModal"></loading-svg>
					<div class="filterable">
						<h4>Filter Item : </h4>
						<!-- <div class="item-filter">
							<label>Produk</label>
							<el-select v-model="modalFilterProduct">
								<el-option label="Semua Produk" value=""></el-option>
								<el-option
									v-for="(dataProduk, indexProduk) in itemsDataProduct"
									:key="indexProduk+'produk'"
									:label="dataProduk.name"
									:value="dataProduk.id"></el-option>
							</el-select>
						</div> -->
						<div class="item-filter" v-if="modalFilterColour !== ''">
							<label>Warna</label>
							<el-select v-model="modalFilterColour">
								<el-option
									v-for="(dataColour, indexColour) in itemsDataColour"
									:key="indexColour+'colour'"
									:label="dataColour.name"
									:value="dataColour.id"></el-option>
							</el-select>
						</div>
						<div class="item-filter">
							<label>Status</label>
							<el-select v-model="modalFilterStatus">
								<el-option label="Semua Status" value=""></el-option>
								<el-option label="Warehouse" value="warehouse"></el-option>
								<el-option label="Toko" value="store"></el-option>
								<el-option label="User" value="user"></el-option>
							</el-select>
						</div>
						<!-- <div class="item-filter">
							<label>Tipe</label>
							<el-select v-model="modalFilterTipe">
								<el-option value="" label="Semua Tipe"></el-option>
								<el-option value="bike" label="Bike"></el-option>
								<el-option value="sparepart" label="Sparepart"></el-option>
							</el-select>
						</div> -->
						<div class="item-filter">
							<label>Warehouse</label>
							<el-select v-model="modalFilterWarehouse">
								<el-option value="" label="Semua Warehouse"></el-option>
								<el-option
									v-for="(dataWarehouse, indexWarehouse) in itemsDataWarehouse"
									:key="indexWarehouse+'warehouse'"
									:label="dataWarehouse.name"
									:value="dataWarehouse.id"></el-option>
							</el-select>
						</div>
					</div>
					<div class="item-fill">
						<label>Item</label>
						<el-select
							v-model="modalitemsIds"
							placeholder="Pilih Item"
							:popper-append-to-body="false"
							class="custom-select-width"
							style="width: 100%;"
							filterable
							remote
							:remote-method="remoteMethodItems"
							:loading="loadingItemsDataPopup">
							<el-option
								v-for="(dataProduct, indexProduct) in itemsDataProductItem"
								:key="indexProduct"
								:label="(modalFilterColour !== '') ? dataProduct.chassis_number : dataProduct.name"
								:value="dataProduct.id">
								<div v-if="modalFilterColour !== ''">
									<b>Kode</b> : {{dataProduct.code}}
								</div>
								<div>
									<b>Nama</b> : {{dataProduct.name}}
								</div>
								<div v-if="modalFilterColour !== ''">
									<b>N. Rangka</b> : {{dataProduct.chassis_number}}
								</div>
								<div v-if="modalFilterColour !== ''">
									<b>N. Mesin</b> : {{dataProduct.machine_number}}
								</div>
								<div v-if="modalFilterColour !== ''">
									<b>Warna</b> :
									<span v-if="dataProduct.colour">{{dataProduct.colour.name}}</span>
								</div>
							</el-option>
						</el-select>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button round class="button-white-green" @click.prevent="acceptItem()" type="primary">Submit</el-button>
				</span>
			</el-dialog>
			<el-dialog
				title="Alasan Hapus Surat Jalan"
				:visible.sync="modalDeleteSuratJalan"
				width="40%"
				top="5vh"
				class="mb-dialog nopadding-right point-modal kepala-regional">
				<div class="content-dialog detail-pencapaian">
					<el-input type="textarea" rows="5" v-model="modalReasonDeleteSuratJalan"></el-input>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button round class="button-white-green" @click.prevent="deletePost(modalDeleteIdSuratJalan)" type="primary">Delete Surat Jalan</el-button>
				</span>
			</el-dialog>
        </div>
		<div class="print-surat-jalan" v-if="itemDataPrint.length !== 0">
			<div class="header-print">
				<table>
					<tr>
						<td>
							<img src="@/assets/images/logo-print.png" class="logo-surat-jalan">
						</td>
						<td align="right">
							<div v-if="performanceInvoice == false" class="head-note head-surat-jalan">SURAT JALAN</div>
							<div v-else class="head-note head-surat-jalan">PROFORMA INVOICE</div>
							<div class="head-note number" v-if="performanceInvoice == false">No: {{itemDataPrint.number}}</div>
							<div class="head-note number" v-else>No: inv{{itemDataPrint.number.substr(2)}}</div>
							<div class="head-note date">Tgl: {{itemDataPrint.created_at | moment('DD-MMM-YYYY')}}</div>
						</td>
					</tr>
				</table>
			</div>
			<div class="sub-header" v-if="itemDataPrint.purchase_order">
				<table>
					<tr>
						<td width="190">
							<table class="notes-from" border="1">
								<tr>
									<td>Dari: <b>PT. Jarvis Lintas Mandiri</b></td>
								</tr>
								<tr>
									<td>
										<div v-if="itemDataPrint.purchase_order">
											<div v-if="itemDataPrint.purchase_order.warehouse">
												{{itemDataPrint.purchase_order.warehouse.address}}
											</div>
										</div>
									</td>
								</tr>
								<tr>
									<td>No. Kendaraan: </td>
								</tr>
							</table>
						</td>
						<td align="right" style="padding-left: 15px;">
							<table class="notes-to" border="1">
								<tr>
									<td>Kepada : </td>
								</tr>
								<tr v-if="itemDataPrint.purchase_order.type == 'store'">
									<td>
										<div v-if="itemDataPrint.purchase_order.store">
											{{itemDataPrint.purchase_order.store.name}}
										</div>
									</td>
								</tr>
								<tr>
									<td v-if="itemDataPrint.purchase_order.buyer !== null">
										<span>{{itemDataPrint.purchase_order.buyer}}</span>
									</td>
									<td v-else>
										<span>
											<div v-if="itemDataPrint.purchase_order.type == 'store'">
												<div v-if="itemDataPrint.purchase_order.store">
													<span v-if="itemDataPrint.purchase_order.store.pic !== null">{{itemDataPrint.purchase_order.store.pic}}</span>
													<span v-else>-</span>
												</div>
											</div>
											<div v-else>-</div>
										</span>
									</td>
								</tr>
								<tr>
									<td v-if="itemDataPrint.purchase_order.address && itemDataPrint.purchase_order.address !== null && itemDataPrint.purchase_order.address !== ''">
										<div>
											{{itemDataPrint.purchase_order.address}}
										</div>
									</td>
									<td v-else>
										<div>
											<div v-if="itemDataPrint.purchase_order.type == 'store'">
												<div v-if="itemDataPrint.purchase_order.store">
													<span v-if="itemDataPrint.purchase_order.store.address !== null">{{itemDataPrint.purchase_order.store.address}}</span>
													<span v-else>-</span>
												</div>
											</div>
											<div v-else>-</div>
										</div>
									</td>
								</tr>
								<tr>
									<td v-if="itemDataPrint.purchase_order.phone && itemDataPrint.purchase_order.phone !== null && itemDataPrint.purchase_order.phone !== ''">
										<div>
											{{itemDataPrint.purchase_order.phone}}
										</div>
									</td>
									<td v-else>
										<div>
											<div v-if="itemDataPrint.purchase_order.type == 'store'">
												<div v-if="itemDataPrint.purchase_order.store">
													<span v-if="itemDataPrint.purchase_order.store.phone !== null">{{itemDataPrint.purchase_order.store.phone}}</span>
													<span v-else>-</span>
												</div>
											</div>
											<div v-else>-</div>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
			<div class="body-print">
				<table border="1">
					<thead>
						<tr>
							<th align="center">No</th>
							<th align="center">Banyaknya</th>
							<th align="center">Nama Barang</th>
							<th align="center">Keterangan</th>
							<th v-if="performanceInvoice == true" align="center">Harga</th>
							<th v-if="performanceInvoice == true" align="center">Diskon</th>
							<th v-if="performanceInvoice == true" align="center">SubTotal</th>
						</tr>
					</thead>
					<tbody v-if="itemDataPrint.details.length !== 0">
						<tr
							v-for="(dataProduct, indexProduct) in itemDataPrint.details"
							:key="indexProduct">
							<td align="center">{{indexProduct + 1}}</td>
							<td align="center">{{dataProduct.qty}} Unit</td>
							<td>
								<div v-if="dataProduct.item">
									<div>Sepeda Listrik {{dataProduct.item.name}} warna <span v-if="dataProduct.item.colour">{{dataProduct.item.colour.name}}</span> + charge</div>
									<div>No. Mesin: {{dataProduct.item.machine_number}}</div>
									<div>No. Rangka: {{dataProduct.item.chassis_number}}</div>
								</div>
							</td>
							<td></td>
							<td v-if="performanceInvoice == true">
								Rp. {{formatPrice(dataProduct.price)}}
							</td>
							<td v-if="performanceInvoice == true">
								Rp. {{formatPrice(dataProduct.discount)}}
							</td>
							<td v-if="performanceInvoice == true">
								Rp. {{formatPrice(dataProduct.subtotal)}}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="body-print" style="margin-bottom: 5px; margin-top: 5px;">
				<table>
					<tr>
						<td style="width:57%;vertical-align: top;">
							<div class="notes">
								<span v-if="performanceInvoice == false">Total Unit : {{itemDataPrint.total_unit}}<br></span>
								<span v-if="performanceInvoice == false">Shipping Fee : Rp. {{formatPrice(itemDataPrint.shipping_fee)}}</span>
								<div class="notes-formats">
									<span style="display: inline-block; vertical-align: top;">Note :</span>
									<div class="notes-print-view" v-html="notesPrintItem"></div>
								</div>
							</div>
						</td>
						<td style="width:30%;vertical-align: top; padding-right: 0;" v-if="performanceInvoice == true">
							<table>
								<tr>
									<td style="padding: 0;">
										<table border="1">
											<tr>
												<td align="left" width="150"><b>Shipping Fee</b></td>
												<td align="right">
													Rp. {{formatPrice(itemDataPrint.shipping_fee)}}
												</td>
											</tr>
											<tr>
												<td align="left" width="150"><b>Total Unit</b></td>
												<td align="right">
													{{itemDataPrint.total_unit}} Unit
												</td>
											</tr>
											<tr>
												<td align="left"><b>SubTotal</b></td>
												<td align="right">Rp. {{formatPrice(getSubTotal)}}</td>
											</tr>
											<tr>
												<td align="left"><b>Total Discount</b></td>
												<td align="right">Rp. {{formatPrice(getDiscountTotal)}}</td>
											</tr>
											<tr>
												<td align="left"><b>Total</b></td>
												<td align="right">Rp. {{formatPrice(getPriceTotal)}}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</div>
			<div class="signature-print" v-if="performanceInvoice == false">
				<table>
					<tr>
						<td>
							<div><br><b>Tanda Terima,</b></div>
							<br><br><br><br>
							<div class="signature-dot">(................................................)</div>
						</td>
						<td>
							<div><br><b>Pengemudi</b></div>
							<br><br><br><br>
							<div class="signature-dot">(................................................)</div>
						</td>
						<td>
							<div>Hormat Kami,<br><b>Administrasi</b></div>
							<br><br><br><br>
							<div class="signature-dot">(................................................)</div>
						</td>
						<td>
							<div><br><b>Gudang</b></div>
							<br><br><br><br>
							<div class="signature-dot">(................................................)</div>
						</td>
					</tr>
					<!-- <tr>
						<td colspan="3" style="padding-top: 30px;"><img src="@/assets/images/footer.png" class="footer"></td>
					</tr> -->
				</table>
			</div>
			<div class="signature-print" style="margin-top: 0px;" v-else>
				<table>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td style="text-align: right;">
							<div style="text-align: center;">Hormat Kami,<br><b>Finance</b></div>
							<br><br><br><br>
							<div class="signature-dot">(................................................)</div>
						</td>
					</tr>
				</table>
			</div>
		</div>
    </div>
</template>

<script>
import {
    faPlusCircle,
	faTrash,
	faPrint,
	faEdit,
	faFileInvoice
} from '@fortawesome/free-solid-svg-icons'
import XLSX from 'xlsx'
import {Money} from 'v-money'
import pageHeader from '@/components/pageHeader'
import loadingSvg from '@/components/loadingSvg'

let dateNow = new Date()

let date = new Date()
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

let getfirstLastDateofYear = new Date().getFullYear() - 1
let getfirstDateofYear = new Date(getfirstLastDateofYear, 0, 1)
let getlastDateofYear = new Date(new Date().getFullYear(), 11, 31)

let getFirstYear = new Date(getfirstDateofYear).getFullYear()
let getLastYear = new Date(getlastDateofYear).getFullYear()

export default {
    name: 'delivery-sale',
    components: {
		pageHeader,
		loadingSvg,
		Money,
		'summernote' : require('@/functions/Summernote'),
	},
    data(){
        return{
			sectionApi: "sale",
			sectionApiPurchaseOrder: "purchaseOrder",
			sectionApiItemProduct: "item",
			sectionApiProduct: "product",
			sectionApiColour: "colour",
			sectionApiWarehosue: "warehouse",
            limit: 10,
            page: 1,
            loading: false,
			loadingForm: false,
			loadingExcel: false,
			itemsData: [],
			itemsDataPurchaseOrder: [],
			itemsDataProductItem: [],
			itemDataDetail: [],
			itemDataPrint: [],
			itemDataExcel: [],
			itemsDataProduct: [],
			itemsDataColour: [],
			itemsDataWarehouse: [],
            totalPage: 0,
            searchQuery: "",
            titleForms: "",
            formsType: "",
            messagesuccess: "",
			messageerror: "",
			productItemsCount: [],
			datePrint: dateNow,
			totalUnit: 0,
			emptyTextProduct: "No data available in table",
			dateRange: [this.$FUNCTIONS.formatDate(firstDay), this.$FUNCTIONS.formatDate(lastDay)],
			format: 'yyyy-MM-dd',
			dateRangeYear: [this.$FUNCTIONS.formatDate(getfirstDateofYear), this.$FUNCTIONS.formatDate(getlastDateofYear)],
            forms: {
                purchase_order: "",
				type: "sale",
				periodFirstPO: getFirstYear,
				periodLastPO: getLastYear,
				shippingFee: 0,
            },
            rules: {
                purchase_order: [ { required: true, message: "Inputan Harus diisi", trigger: "blur" } ],
			},
			formsProduct: {
				checked_items: [],
				item_ids: [],
				item_fake: [],
				item_ids_real: [],
            },
            readOnly:{
				item_ids: [],
            },
            dataTextCreate: "Buat Surat Jalan",
            dataTextUpdate: "Edit Surat Jalan",
            confirmDescDelete: "Anda yakin akan menghapus data Surat Jalan dari daftar?",
            confirmTitleDelete: "Hapus Surat Jalan",
            textDataCreateSuccess: "Data Surat Jalan Berhasil ditambahkan.",
            textDataUpdateSuccess: "Data Surat Jalan Berhasil diupdate.",
			textDataDeleteSuccess: "1 Items Berhasil dihapus.",
			fontsIcons:{
                plus: faPlusCircle,
				minus: faTrash,
				print: faPrint,
				edit: faEdit,
				printInvoice: faFileInvoice
			},
			modelNotesItem: false,
			notesPrintItem: "",
			performanceInvoice: false,
			modalItem: false,
			modalItemProdukChoose: [],
			modalItemTitle: "",
			modalitemsIds: "",
			modalFilterProduct: "",
			modalFilterColour: "",
			modalFilterStatus: "warehouse",
			modalFilterTipe: "",
			modalFilterWarehouse: "",
			loadingModal: false,
			modalItemIndex: 0,
			itemsDetailEditProduct: [],
			loadingItemsDataPopup: false,
			toolbarEditorConfig: [
				['font', ['bold', 'italic', 'underline']],
				['para', ['ul', 'ol']],
			],
			modalDeleteSuratJalan: false,
			modalDeleteIdSuratJalan: '',
			modalReasonDeleteSuratJalan: '',
			money: {
                decimal: ',',
                thousands: '.',
                prefix: '',
                suffix: '',
                precision: 0,
                masked: false
			},
        }
    },
    created(){
        this.$FUNCTIONS.checkPermissions(this.$dataRole['.cms.sale.get'])
    },
    mounted(){
		this.getPost()
		// this.getPostItem()
		this.getPostProduct()
		this.getPostColour()
		this.getPostWarehouse()
        this.initCreateFunction()
    },
    watch: {
		modalItem(newValue){
			if(newValue == false){
				this.modalItemProdukChoose = []
				this.modalItemTitle = ""
				this.modalitemsIds = ""
				this.modalFilterProduct = ""
				this.modalFilterColour = ""
				this.modalFilterStatus = "warehouse"
				this.modalFilterTipe = ""
				this.modalFilterWarehouse = ""
				this.loadingModal = false
				this.modalItemIndex = 0
			}
		},
        searchQuery: function(){
            this.getResult()
            this.$FUNCTIONS.checkPaginations()
		},
		modalFilterProduct(){
			this.getPostItem('')
		},
		modalFilterColour(){
			this.getPostItem('')
		},
		modalFilterStatus(){
			this.getPostItem('')
		},
		modalFilterTipe(){
			this.getPostItem('')
		},
		modalFilterWarehouse(){
			this.getPostItem('')
		},
		dateRange(){
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
		async getPostPurchaseOrder(){
            try{
				let url = this.$baseUrl + this.sectionApiPurchaseOrder
						  + "?limit=1000&page=1"
						  + "&start_date=" + this.dateRangeYear[0]
						  + "&end_date=" + this.dateRangeYear[1]
				const response = await this.$services.getList(url)
				this.loadingForm = false
                if(response.status == 200){
					if(this.formsType == 'create'){
						let dataPO = response.data.data
						this.itemsDataPurchaseOrder = []
						dataPO.forEach(function(e){
							if(e.status !== 'success' && e.details.length !== 0){
								this.itemsDataPurchaseOrder.push(e)
							}
						}, this)
					}else{
						this.itemsDataPurchaseOrder = response.data.data
					}
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		remoteMethodItems(query){
			console.log(query)
			let that = this
			if (query !== '') {
				this.loadingItemsDataPopup = true
				setTimeout(function(){
					that.getPostItem(query)
				}, 1500)
			}else{
				this.getPostItem('')
			}
		},
		async getPostItem(search){
            try{
				// this.loadingModal = true
				let url =
					this.$baseUrl
					+ this.sectionApiItemProduct
					+ "?limit=30&page=1"
					+ "&product_id=" + this.modalFilterProduct
					+ "&colour_id=" + this.modalFilterColour
					+ "&warehouse_id=" + this.modalFilterWarehouse
					// + "&type=" + this.modalFilterTipe
					+ "&status=" + this.modalFilterStatus
					+ "&chassis_number=" + search
				const response = await this.$services.getList(url)
				// this.loadingModal = false
				this.loadingItemsDataPopup = false
                if(response.status == 200){
                    this.itemsDataProductItem = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
				this.loadingModal = false
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostProduct(){
            try{
				let url = this.$baseUrl + this.sectionApiProduct + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataProduct = response.data.data
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
                    this.itemsDataColour = response.data.data
                }else{
                    this.$FUNCTIONS.checkErrorResponse(response.status)
                }
            }catch(err){
                this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
            }
		},
		async getPostWarehouse(){
            try{
				let url = this.$baseUrl + this.sectionApiWarehosue + "?limit=1000&page=1"
                const response = await this.$services.getList(url)
                if(response.status == 200){
                    this.itemsDataWarehouse = response.data.data
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
					document.getElementById("save").children[0].innerHTML = "Simpan"
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
                    const response = await this.$services.putList(url, credentials)
                    if(response.status == 201) {
                        this.messagesuccess = this.textDataDeleteSuccess
                        this.getPost()
						this.closeModal()
						this.modalDeleteSuratJalan = false
						this.modalDeleteIdSuratJalan = ''
						this.modalReasonDeleteSuratJalan = ''
                    }else{
                        this.$FUNCTIONS.notify('error', 'Error', this.$textErrorDelete)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
            }else if(type == "detail"){
                try{
                    this.loadingForm = true
                    const response = await this.$services.getList(url)
                    this.loadingForm = false
                    if(response.status == 200){
                        this.itemDataDetail = response.data
                        this.forms.name = this.itemDataDetail.name
                        this.forms.code = this.itemDataDetail.code
                    }else if(response.status == 400){
                        this.$FUNCTIONS.logout("expired-token", this.$textTokenExpired)
                    }else{
                        this.$FUNCTIONS.notify("error", "Error", this.$textNodata)
                    }
                }catch(err){
                    this.$FUNCTIONS.checkError400Response(this.$textError, err.response.data)
                }
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
						this.itemDataExcel = response.data.data

						let that = this
						setTimeout(function(){
							that.loadingExcel = false
							var wscols = [
								{wch:15},
								{wch:15},
								{wch:15},
								{wch:15},
								{wch:15},
								{wch:15},
								{wch:15},
								{wch:20},
								// {wch:20},
								{wch:30},
								{wch:40},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
								{wch:20},
							];
							var datas = XLSX.utils.table_to_sheet(document.getElementById('table-export-sale'))
							datas['!cols'] = wscols;
							var wb = XLSX.utils.book_new()
							let filename = "surat-jalan-jarvis"
							XLSX.utils.book_append_sheet(wb, datas, 'Surat Jalan')
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
                let url = this.buildUrl(false) + "/delete/" + id
                this.postFunction("delete", { delete_reason: this.modalReasonDeleteSuratJalan }, url)
            });
        },
        handleCurrentChange(val) {
            if (val) {
                if(val.invoice_number == null || val.invoice_number == ""){
					let that = this
                    this.titleForms = this.dataTextUpdate
					this.formsType = "edit"
					this.loadingForm = true
					this.itemDataDetail = val
					this.forms.purchase_order = this.itemDataDetail.purchase_order_id
					this.forms.type = this.itemDataDetail.type
					this.forms.shippingFee = this.itemDataDetail.shipping_fee
					this.totalUnit = this.itemDataDetail.total_unit
					this.itemsDetailEditProduct = []

					this.itemDataDetail.details.forEach(function(e){
						this.itemsDetailEditProduct.push(e)
					}, this)

					this.getPostPurchaseOrder()

					setTimeout(function(){
						that.purchaseOrderChangeEdit(that.itemDataDetail.purchase_order_id)
						that.loadingForm = false
					}, 1000)

					this.$FUNCTIONS.sidebarToggle(true)
                }else{
                    this.$FUNCTIONS.notify('info', 'Maaf', 'Surat Jalan tidak bisa diedit karena sudah ada invoice number')
                }
            }
		},
        submitSave(formName, formtype) {
            this.messagesuccess = ""
			this.messageerror = ""

			if(this.formsType == 'create'){
				this.submitCreateFunctions(formName, formtype)
			}else{
				this.submitEditFunctions(formName, formtype)
			}
		},
		submitCreateFunctions(formName, formtype){
			let loadingform = this.$FUNCTIONS.svgSpinner
			let dataPoDetailId = []
			let dataItemId = []
			let dataErrorCheckStatus = []
			let dataErrorItem = []
			if(this.formsProduct.item_ids_real.length !== 0){
				this.formsProduct.item_ids_real.forEach(function(e, i){
					if(e.item_ids !== '' && e.item_ids){
						dataItemId.push(e.item_ids)
						if(e.data.status !== 'success'){
							dataPoDetailId.push(e.data.id)
						}else{
							dataErrorCheckStatus.push('error')
						}
					}else{
						dataErrorItem.push('error')
					}
				}, this)
			}

			if(this.formsProduct.item_ids_real.length !== 0){
				if(dataErrorItem.length == 0){
					if(dataErrorCheckStatus.length == 0){
						let dataForms = {
							purchase_order_id: this.forms.purchase_order,
							item_ids: dataItemId,
							type: this.forms.type,
							po_details_ids : dataPoDetailId,
							total_unit: this.totalUnit,
							shipping_fee: this.forms.shippingFee
						}

						this.$refs[formName].validate(valid => {
							if (valid) {
								document.getElementById("save").children[0].innerHTML = loadingform
								this.postFunction("post", dataForms, this.buildUrl(false))
							}
						})
					}else{
						this.$FUNCTIONS.notify('error', 'Error', 'Item sudah pernah di buat sebelumnya')
					}
				}else{
					this.$FUNCTIONS.notify('error', 'Error', 'Pilih item untuk menyimpan surat jalan')
				}
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'Pilih produk untuk menyimpan surat jalan')
			}
		},
		submitEditFunctions(formName, formtype){
			let loadingform = this.$FUNCTIONS.svgSpinner
			let dataPoDetailId = []
			let dataItemId = []
			let dataProductId = []
			let dataStatuses = []
			let dataErrorItem = []

			if(this.formsProduct.item_ids_real.length !== 0){
				this.formsProduct.item_ids_real.forEach(function(e, i){
					if(e.item_ids !== '' && e.item_ids){
						dataItemId.push(e.item_ids)
						dataPoDetailId.push(e.data.id)
						dataProductId.push(e.data.product_id)
						if(e.data.status == 'success'){
							dataStatuses.push('old')
						}else{
							dataStatuses.push('new')
						}
					}else{
						dataErrorItem.push('error')
					}
				}, this)
			}
			let dataForms = {
				type: this.forms.type,
				ids: dataPoDetailId,
				item_ids: dataItemId,
				product_ids: dataProductId,
				statuses: dataStatuses,
				total_unit: this.totalUnit,
				shipping_fee: this.forms.shippingFee
			}

			if(this.formsProduct.item_ids_real.length !== 0){
				if(dataErrorItem.length == 0){
					this.$refs[formName].validate(valid => {
						if (valid) {
							document.getElementById("save-edit").children[0].innerHTML = loadingform
							let urlv = this.buildUrl(false) + "/" + this.itemDataDetail.id
							this.postFunction("put", dataForms, urlv)
						}
					})
				}else{
					this.$FUNCTIONS.notify('error', 'Error', 'Pilih item untuk menyimpan surat jalan')
				}
			}else{
				this.$FUNCTIONS.notify('error', 'Error', 'Pilih produk untuk menyimpan surat jalan')
			}
		},
        initCreateFunction() {
            let that = this
            setTimeout(function() {
                document.querySelector(".add-click-forms").addEventListener("click", function() {
                    if(that.loading == false){
                        that.titleForms = that.dataTextCreate
						that.formsType = "create"
						that.getPostPurchaseOrder()
                        that.$FUNCTIONS.sidebarToggle(true)
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
			this.getPostPurchaseOrder()
			this.forms.purchase_order = ""
			this.forms.type = "sale"
			this.forms.periodFirstPO = getFirstYear
			this.forms.periodLastPO = getLastYear
			this.formsProduct.checked_items = []
			this.formsProduct.item_ids = []
			this.formsProduct.item_ids_real = []
			this.formsProduct.item_fake = []
			this.readOnly.item_ids = []
			this.totalUnit = 0
			this.forms.shippingFee = 0
			this.emptyTextProduct = "No data available in table"
			this.dateRangeYear = [this.$FUNCTIONS.formatDate(getfirstDateofYear), this.$FUNCTIONS.formatDate(getlastDateofYear)]
			this.getPostPurchaseOrder()
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
		removeProductInput(index){
			this.productItemsCount--
			this.formsProduct.item_ids.splice(index, 1)
			this.readOnly.item_ids.splice(index, 1)
		},
		searchArray(nameKey, myArray){
            for (var i=0; i < myArray.length; i++) {
                if (myArray[i].id === nameKey) {
                    return myArray[i];
                }
            }
		},
		purchaseOrderChange(val){
			let that = this
			let datas = this.searchArray(val, this.itemsDataPurchaseOrder)
			let countSuccess = []
			this.formsProduct.checked_items = []
			this.formsProduct.item_ids = []
			this.formsProduct.item_fake = []
			this.formsProduct.item_ids_real = []
			if(datas.details){
				if(datas.details.length !== 0){
					if(this.formsType == 'create'){
						let indexTest = 0
						datas.details.forEach(function(e, i){
							if(e.status !== 'success'){
								indexTest++
								this.formsProduct.checked_items.push({
									index: (indexTest - 1),
									data: e
								})
								this.formsProduct.item_ids.push('')
								this.formsProduct.item_fake.push('')
							}else{
								countSuccess.push('success')
							}
						}, this)
						if(countSuccess.length == datas.details.length){
							this.emptyTextProduct = "Data Produk telah dibuat Surat Jalan"
						}else{
							this.emptyTextProduct = "Tidak ada Produk di Purchase Order ini"
						}
					}else{
						datas.details.forEach(function(e, i){
							this.formsProduct.checked_items.push({
								data: e
							})
							this.formsProduct.item_ids.push('')
							this.formsProduct.item_fake.push('')
							setTimeout(function(){
								if(e.status == 'success'){
									that.$refs.singleTableItems.toggleRowSelection(that.formsProduct.checked_items[i])
								}
							}, 200)
						}, this)
					}
				}else{
					this.emptyTextProduct = "Tidak ada Produk di Purchase Order ini"
				}
			}
		},
		purchaseOrderChangeEdit(val){
			let that = this
			let datas = this.searchArray(val, this.itemsDataPurchaseOrder)
			let countSuccess = []
			this.formsProduct.checked_items = []
			this.formsProduct.item_ids = []
			this.formsProduct.item_fake = []
			this.formsProduct.item_ids_real = []
			if(datas.details){
				if(datas.details.length !== 0){
					datas.details.forEach(function(e, i){
						// console.log('data purchase order', e.id)
						if(e.status !== 'success'){
							this.formsProduct.checked_items.push({
								data: e
							})
							this.formsProduct.item_fake.push('')
						}else{
							this.itemsDetailEditProduct.forEach(function(ee, ii){
								// console.log('data detail item', ee.po_detail_id)
								if(ee.po_detail_id == e.id){
									this.formsProduct.item_fake.push(ee.item)

									this.formsProduct.checked_items.push({
										data: e,
										item_ids: ee.item.id
									})
								}
							}, this)
						}
					}, this)
					this.formsProduct.item_fake.forEach(function(e, i){
						setTimeout(function(){
							if(e !== ""){
								that.$refs.singleTableItems.toggleRowSelection(that.formsProduct.checked_items[i])
							}
						}, 200)
					})
				}else{
					this.emptyTextProduct = "Tidak ada Produk di Purchase Order ini"
				}
			}
		},
		handleSelectionChange(val){
			this.formsProduct.item_ids_real = val
			this.totalUnit = this.formsProduct.item_ids_real.length
		},
		printSuratJalan(val){
			let that = this
			this.loading = true
			this.modelNotesItem = false
			setTimeout(function(){
				that.loading = false
				window.print()
			}, 1000)
		},
		openModelItem(val, index){
			this.modalItem = true
			this.modalItemProdukChoose = val
			if(val.product){
				let productName = (val.product) ? val.product.name : '-'
				let colourName = (val.colour) ? ('- ' + val.colour.name) : '-'
				if(val.colour_id == ''){
					this.modalItemTitle = productName
				}else{
					this.modalItemTitle = productName + colourName
				}
			}
			this.modalFilterProduct = val.product_id
			this.modalFilterColour = val.colour_id
			this.modalItemIndex = index
			this.$refs.singleTableItems.clearSelection()
			this.getPostItem('')
		},
		acceptItem(){
			let errorDataIdItem = []
			this.formsProduct.item_ids.forEach(function(e){
				if(this.modalitemsIds == e){
					errorDataIdItem.push('error')
				}
			}, this)

			if(errorDataIdItem.length !== 0){
				this.$FUNCTIONS.notify('error', 'Error', 'Item produk sudah ada pada list')
			}else{
				this.modalItem = false
				let dataValue = this.searchArray(this.modalitemsIds, this.itemsDataProductItem)
				this.formsProduct.checked_items[this.modalItemIndex]['item_ids'] = this.modalitemsIds
				this.formsProduct.item_ids.splice(this.modalItemIndex, 1, this.modalitemsIds)
				this.formsProduct.item_fake.splice(this.modalItemIndex, 1, dataValue)

				this.formsProduct.item_fake.forEach(function(e, i){
					if(e !== ""){
						this.$refs.singleTableItems.toggleRowSelection(this.formsProduct.checked_items[i])
					}
				}, this)
			}
		},
		openNotesModal(value, performanceInvoice){
			let that = this
			this.itemDataPrint = value
			this.modelNotesItem = true
			this.performanceInvoice = performanceInvoice
			setTimeout(function(){
				if(performanceInvoice == true){
					// that.notesPrintItem = "<p>Mohon pembayaran ditransfer ke rekening bank berikut :</p><p><b><i>BCA cabang Sunter<br>acc 659-0153867<br>a/n PT. JARVIS LINTAS MANDIRI</i></b></p><p>Pembayaran baru dianggap sah setelah dana masuk ke rekening perusahaan.</p>"
					$('.testingnotesummer').summernote('code', "<p>Mohon pembayaran ditransfer ke rekening bank berikut :</p><p><b><i>BCA cabang Sunter<br>acc 659-0153867<br>a/n PT. JARVIS LINTAS MANDIRI</i></b></p><p>Pembayaran baru dianggap sah setelah dana masuk ke rekening perusahaan.</p>")
				}else{
					// that.notesPrintItem = ''
					$('.testingnotesummer').summernote('code', '')
				}
			}, 200)
		},
		periodChange(value){
			let newDate = new Date(this.dateRangeYear[0])
			newDate.setFullYear(value)
			this.dateRangeYear[0] = this.$FUNCTIONS.formatDate(newDate)
			this.loadingForm = true
			this.getPostPurchaseOrder()
		}
    },
	computed:{
		getDiscountTotal: function(){
			if(this.itemDataPrint){
				let total = [];

				this.itemDataPrint.details.forEach(element => {
					let price = parseFloat(element.discount)
					total.push(price)
				});

				return total.reduce(function(total, num){ return total + num }, 0);
			}
		},
		getSubTotal: function(){
			if(this.itemDataPrint){
				let total = [];

				this.itemDataPrint.details.forEach(element => {
					let price = parseFloat(element.price)
					total.push(price)
				});

				return total.reduce(function(total, num){ return total + num }, 0);
			}
		},
		getPriceTotal: function(){
			if(this.itemDataPrint){
				let total = [];

				this.itemDataPrint.details.forEach(element => {
					let price = parseFloat(element.subtotal)
					total.push(price)
				});

				return total.reduce(function(total, num){ return total + num }, 0);
			}
		},
		getYearData: function(){
			let value = []
			let start_year = new Date().getFullYear()

			for (var i = start_year; i > start_year - 5; i--) {
				value.push(i)
			}

			return value
		}
	}
}
</script>
<style lang="scss" scoped>
.filterable{
	h4{
		font-size: 16px;
	}
	border-bottom: 1px solid #ddd;
	padding-bottom: 15px;
	margin-bottom: 15px;
	.item-filter{
		display: inline-block;
		margin-right: 15px;
		width: 30%;
		margin-bottom: 10px;
		label{
			display: block;
			margin-bottom: 0;
			font-size: 12px;
		}
		.el-select{
			width: 100%;
		}
	}
}
.item-fill{
	label{
		display: block;
		margin-bottom: 0;
		font-size: 14px;
	}
}
.print-surat-jalan{
	display: none;
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
@media print {
	.mb-dialog{
		display: none;
	}
	.print-surat-jalan{
		padding: 0 45px 0;
		display: block;
		table{
			width: 100%;
		}
		.header-print{
			margin-bottom: 10px;
			table{
				td{
					width: 50%;
					vertical-align: top;
					img{
						max-width: 135px !important;
    					width: 100%;
					}
					.head-note{
						margin-bottom: 5px;
						font-size: 10px;
						&.head-surat-jalan{
							font-weight: bold;
							font-size: 12px;
						}
					}
				}
			}
		}
		.sub-header{
			table{
				font-size: 10px;
				td{
					vertical-align: top;
				}
				&.notes-from{
					td{
						padding: 2px 5px;
					}
				}
				&.notes-to{
					td{
						width: 25px;
						padding: 2px 5px;
						&:first-child{
							width: 60%;
						}
					}
				}
			}
		}
		.body-print{
			margin-top: 5px;
			.notes{
				margin-top: 0;
				font-size: 13px;
				vertical-align: middle;
				.notes-formats{
					white-space: pre-line;
				}
			}
			table{
				font-size: 10px;
				th{
					text-align: center;
					padding: 2px 5px;
				}
				td{
					padding: 2px 5px;
				}
			}
		}
		.signature-print{
			margin-top: 5px;
			table{
				font-size: 10px;
				tr{
					&:first-child{
						td{
							width: 33.3333333%;
						}
					}
				}
				td{
					text-align: center;
				}
			}
		}
	}
}
</style>
